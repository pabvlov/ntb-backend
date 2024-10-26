const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
const port = 3000;

const authRouter = require("./app/routes/auth.routes");
const userRouter = require("./app/routes/user.routes");
const communityRouter = require("./app/routes/community.routes");
const classRouter = require("./app/routes/class.routes");
const groupRouter = require("./app/routes/group.routes");
const elementRouter = require("./app/routes/element.routes");
const warmupRouter = require("./app/routes/warm-up.routes");
const physicalpreparationRouter = require("./app/routes/physical-preparation.routes");
const worklineRouter = require("./app/routes/workline.routes");
const planificationRouter = require("./app/routes/planification.routes");
const path = require('path');

app.use(express.json());

// Definir rutas estáticas con prefijos específicos
app.use('/images', express.static(path.join(__dirname, 'app/images')));
app.use('/profiles', express.static(path.join(__dirname, 'app/images/profiles')));
app.use('/app', express.static(path.join(__dirname, 'app/images/app')));
app.use('/elements', express.static(path.join(__dirname, 'app/images/elements')));
app.use('/warmups', express.static(path.join(__dirname, 'app/images/warmups')));
app.use('/physicalpreparations', express.static(path.join(__dirname, 'app/images/physicalpreparations')));
app.use('/banners', express.static(path.join(__dirname, 'app/images/banners')));
app.use('/content', express.static(path.join(__dirname, 'app/images/content')));

app.use(
    express.urlencoded({
      extended: true,
    })
);
"use strict";
app.get("/", (req, res) => {
    res.json({ message: "ok" });
});

/* routes */

/* AUTH */

app.post("/auth/register", authRouter);
app.post("/auth/login", authRouter);
app.post("/auth/renew", authRouter);
app.post("/auth/regenerate", authRouter);

/* USER */

app.get("/user/find", userRouter);
app.get("/user/communities", userRouter);
app.get("/user/athletes", userRouter);
app.post("/user/athlete/create", userRouter);
app.post("/user/athlete/createInactive", userRouter);
app.post("/user/setRole", userRouter);
app.post("/user/unsetRole", userRouter);

/* COMMUNITY */

app.get("/community/info", communityRouter);
app.post("/community/banner/upload", communityRouter);
app.post("/community/comment/upload", communityRouter);
app.delete("/community/comment/delete", communityRouter);
app.delete("/community/banner/delete", communityRouter);
app.put("/community/logo/upload", communityRouter);
app.get("/establishment/roles", communityRouter);

/* ALL CLASSES */

app.post("/class/create", classRouter);
app.put("/class/changeDate", classRouter);
app.put("/class/changeTeacher", classRouter);
app.put("/class/attachPlanification", classRouter);
app.delete("/class/delete", classRouter);
app.delete("/class/warmup", classRouter);
app.delete("/class/physicalpreparation", classRouter);
app.get("/class/show", classRouter);
app.get("/class/showBetweenDates", classRouter);
app.get("/class/showByTeacher", classRouter);
app.get("/class/showByGroup", classRouter);
app.get("/class/today", classRouter);
app.put("/class/attachPlanifications", classRouter);
app.post("/class/presence", classRouter);

/* PLANIFICATIONS */

app.post("/planification/insertWarmUp", planificationRouter)
app.post("/planification/insertPhysicalPreparation", planificationRouter);
app.post("/planification/deleteWarmUp", planificationRouter)
app.post("/planification/deletePhysicalPreparation", planificationRouter);
app.post("/planification/create", planificationRouter);
app.post("/planification/achievement", planificationRouter);
app.get("/planification/achievements", planificationRouter);
app.get("/planification/show", planificationRouter);
app.post("/planification/build", planificationRouter);
app.delete("/planification/delete", planificationRouter);

/* GROUP */

app.post("/group/create", groupRouter);
app.post("/group/insertAthlete", groupRouter);
app.get("/groups", groupRouter);
app.get("/group/withAthletes", groupRouter);
app.get("/group/difficulties", groupRouter);

/* ELEMENT */

app.post("/elements", elementRouter);
app.post("/element/create", elementRouter);
app.delete("/element/delete", elementRouter);
app.post("/element/attach", elementRouter);
app.delete("/element/detach", elementRouter);
app.post("/element/image/upload", elementRouter);
app.get("/apparatus/show", elementRouter);

/* WARM UP */

app.post("/warmup/create", warmupRouter);
app.delete("/warmup/delete", warmupRouter);
app.get("/warmup/show", warmupRouter);
app.get("/warmup/showByClass", warmupRouter);

/* PHYSICAL PREPARATION */

app.post("/physicalpreparation/create", physicalpreparationRouter);
app.delete("/physicalpreparation/delete", physicalpreparationRouter);
app.get("/physicalpreparation/show", physicalpreparationRouter);
app.get("/physicalpreparation/showByClass", physicalpreparationRouter);

/* WORKLINES */

app.get("/worklines", worklineRouter);

// error handler
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    console.error(err.message, err.stack);
    res.status(statusCode).json({ message: err.message });
    return;
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}.`);
});