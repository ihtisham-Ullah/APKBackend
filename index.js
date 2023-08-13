const cors = require("cors");
const bcrypt = require("bcrypt");
const hash = require("hash");
require("./Models/userDetailScheema");
require("./Models/taskDetailScheema");
require("./Models/sendTaskDetailScheema");
require("./Models/attendanceScheema");
require("./Models/leaveRequestScheema");
require("./Models/MediaScheema");
require("./Models/complaintSchema");

const jwt = require("jsonwebtoken");
const JWT_SECRET = "hjgdhsgd786876$#$%$^%&*hvnsma";
const moment = require("moment");

const Otp = require("./Models/otp");
const express = require("express");
const bodyParser = require("body-parser");

const mongoose = require("mongoose");
var nodemailer = require("nodemailer");

const app = express();
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));


const { response } = require("express");
const { where } = require("./Models/otp");

app.use(bodyParser.json());
app.use(cors());
app.use(express.json());
mongoose.set("strictQuery", false);
const dotenv = require("dotenv");

dotenv.config();

const mongodb = require("./mongodb");

mongodb();

const User = mongoose.model("Userinfo");
const CreateTask = mongoose.model("CreateTask");
const TaskDetail = mongoose.model("TaskDetail");
const ClockIn = mongoose.model("ClockIn");
const LeaveRequest = mongoose.model("LeaveRequest");
const Media = mongoose.model("Media");
const complaint = mongoose.model("complaint");

app.post("/login-user", async (req, res) => {
  const { email, password } = req.body;
  console.log("email..", email);
  console.log("oass", password);

  console.log("req.bodyreq.body", req.body);

  const user = await User.findOne({ email });
  console.log("userrrrrrrr", user);
  if (!user) {
    return res.json({ error: "User Not Found" });
  }
  const ismatch = await bcrypt.compare(password, user.password);

  if (ismatch) {
    const token = jwt.sign({}, JWT_SECRET);
    console.log("LOGGED IN SUCCESSFULLY ");
    if (res.status(201)) {
      return res.json({ status: "ok", token: token, user: user });
    } else {
      return res.json({ status: "error  " });
    }
  } else {
    res.json({ status: "error", error: "Invalid password " });
  }
});

app.post("/emailSend", async (req, res) => {
  const email = req.body.email;
  console.log(email);

  const user = await User.findOne({ email: email });
  console.log(user);
  const responseType = {};
  if (user) {
    let otpcode = Math.floor(Math.random() * 10000 + 1);
    let otpData = new Otp({
      email: req.body.email,
      code: otpcode,
      expireIn: new Date().getTime() + 300 * 1000,
    });
    let otpResponse = await otpData.save();
    mailer(email, otpcode);
    responseType.statusText = "Success";
    responseType.message = "please check your email id";
    console.log(otpResponse);
  } else {
    responseType.statusText = "error";
    responseType.message = "Email id not Exist";
  }
  res.status(200).json(responseType);
});
app.post("/changePassword", async (req, res) => {
  const email = req.body.email;
  console.log(email);

  const responseType = {};
  console.log(req.body.password);

  const hashedpassword = req.body.password;
  const hash = bcrypt.genSaltSync(10);
  const password = bcrypt.hashSync(hashedpassword, hash);
  let data = await Otp.findOne({ email: req.body.email, code: req.body.code });

  if (data) {
    let currentTime = new Date().getTime();
    let diff = data.expireIn - currentTime;
    if (diff < 0) {
      res.send("Token Expired");
    } else {
      const user = await User.findOne({ email });
      console.log(user);

      if (data.code === req.body.code) {
        console.log(password);

        await User.updateOne(
          {
            email: email,
          },
          {
            $set: {
              password: password,
            },
          }
        );
        console.log("saved");

        responseType.statusText = "Success";
        responseType.message = "Password changed successfully";
      } else {
        responseType.statusText = "error";
        responseType.message = "Invalid OTP";
      }
    }
  } else {
    responseType.statusText = "error";
    responseType.message = "Invalid OTP";
  }
  res.status(200).json(responseType);
});

// const mailer = (email, otp) => {
//   var transporter = nodemailer.createTransport({
//     host: "smtp.gmail.com",
//     port: 465,
//     secure: true,
//     auth: {
//       user: "hamzadogar898@gmail.com",
//       pass: "ccwuqjzyqsfjvzyx",
//     },
//   });
//   var mailOptions = {
//     from: "hamzadogar898@gmail.com",
//     to: email,
//     subject: "OTP",
//     text: `Your OTP to recover password is ${otp}`,
//   };
//   transporter.sendMail(mailOptions, function (error, info) {
//     if (error) {
//       console.log(error);
//     } else {
//       console.log("Email sent:" + info.response);
//     }
//   });
// };

const mailer = (email, otp) => {
  // var transporter = nodemailer.createTransport({
  //   host: "smtp.gmail.com",
  //   port: 465,
  //   secure: true,
  //   auth: {
  //     user: "hamzadogar898@gmail.com",
  //     pass: "ccwuqjzyqsfjvzyx",
  //   },
  // });
  // var mailOptions = {
  //   from: "hamzadogar898@gmail.com",
  //   to: email,
  //   subject: "OTP",
  //   text: `Your OTP to recover password is ${otp}`,
  // };
  // transporter.sendMail(mailOptions, function (error, info) {
  //   if (error) {
  //     console.log(error);
  //   } else {
  //     console.log("Email sent:" + info.response);
  //   }
  // });

  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "hamzadogar898@gmail.com",
      pass: "zkhvlbimqejzxzao",
    },
  });

  var mailOptions = {
    from: "workforce@gmail.com",
    to: "ha4363897@gmail.com",
    subject: "Password Reset",
    text: `Your OTP to recover password is ${otp}`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

app.get("/getTasks/:id", async (req, res) => {
  try {
    const ID = req.params?.id;
    console.log("task-id", ID);
    const result = await CreateTask.find({ salespersonId: ID });
    console.log(result);
    if (result) {
      res.send({ result });
    }
  } catch (err) {
    res.send({ result: err.message });
  }
});

app.get("/getVideo/:id", async (req, res) => {
  try {
    const ID = req.params?.id;
    console.log("video", ID);
    const result = await Media.find({ salespersonId: ID });
    console.log(result);
    if (result) {
      res.send({ result });
    }
  } catch (err) {
    res.send({ result: err.message });
  }
});

// app.post("/taskDetail", async (req, res) => {
//   console.log(req.body)
//   const { taskName,
//     taskStatus,
//     CompletedTask,
//     CurrentLocation,
//     feedback,
//     image,userId ,taskId} = req.body;
//   try {
//     await TaskDetail.create({

//       taskName,
//       taskStatus,
//       CompletedTask,
//       CurrentLocation,
//       feedback,
//       image,
//       userId,
//       taskId

//     });

//     res.send({ status: "ok" });

//   } catch (error) {
//     res.send({ status: "Error" });
//   }
// });

app.post("/taskDetail", async (req, res) => {
  console.log(req.body);
  const {
    taskName,
    taskStatus,
    CompletedTask,
    CurrentLocation,
    feedback,
    image,
    userId,
    taskId,
  } = req.body;
  try {
    await CreateTask.deleteOne({ _id: taskId });
    await TaskDetail.create({
      taskName,
      taskStatus,
      CompletedTask,
      CurrentLocation,
      feedback,
      image,
      userId,
      taskId,
    });
    res.send({ status: "ok" });
  } catch (error) {
    res.send({ status: "Error" });
  }
});

// app.get("/tasks/status/:status?", async (req, res) => {
//   const status = req.params.status || "all";
//   console.log("status", status);
//   try {
//     let tasks;
//     if (status === "all") {
//       tasks = await TaskDetail.find();
//     } else if (status === "pending") {
//       tasks = await TaskDetail.find({ taskStatus: "Pending" });
//     } else {
//       tasks = await TaskDetail.find({ taskStatus: status });
//     }
//     res.send({ status: "ok", tasks });
//   } catch (error) {
//     console.error(error);
//     res.send({ status: "Error" });
//   }
// });

app.get("/tasks/status/pending", async (req, res) => {
  try {
    const tasks = await CreateTask.find({ taskStatus: "Pending" });
    res.send({ status: "ok", tasks });
  } catch (error) {
    console.error(error);
    res.send({ status: "Error" });
  }
});

app.get("/tasks/status/completed", async (req, res) => {
  try {
    const tasks = await TaskDetail.find({ taskStatus: "Completed" });
    res.send({ status: "ok", tasks });
  } catch (error) {
    console.error(error);
    res.send({ status: "Error" });
  }
});

app.post("/leaverequest", (req, res) => {
  const leaveRequest = new LeaveRequest({
    // user_id: req.body.user_id,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    reason: req.body.reason,
    // status: 'pending'
  });
  leaveRequest.save((err) => {
    if (err) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(200).json({ message: "Leave request saved" });
    }
  });
});

app.post("/clockin", async (req, res) => {
  const { userId } = req.body;
  const clockIn = new ClockIn({ userId, clockInTime: new Date() });
  await clockIn.save();
  res.status(201).json(clockIn);
});

// PUT endpoint to handle clock out requests
app.put("/clockout/:id", async (req, res) => {
  const { id } = req.params;
  const { clockOutTime } = req.body;
  const clockIn = await ClockIn.findById(id);
  clockIn.clockOutTime = clockOutTime;
  await clockIn.save();
  res.json(clockIn);
});

app.post("/complaint", async (req, res) => {
  try {
    console.log(req.body);
    const { type, message, userId } = req.body;

    // Create new complaint object
    await complaint.create({
      type,
      message,
      userId,
    });

    // Save complaint to database
    res.send({ status: "ok" });
  } catch (error) {
    res.send({ status: "Error" });
  }
});

const PORT= process.env.PORT
app.listen(PORT, () => {
  console.log("Backend server is running");
});
