import React from "react";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { aboutStrings } from "../../../../utils/strings";
import Styles from "./styles";

export default ({
  summary: {
    activityName,
    startTimeGMT,
    distance,
    duration,
    averageSpeed,
    maxSpeed,
    calories,
    averageHR,
    maxHR,
    steps,
    avgStrideLength,
    minElevation,
    maxElevation,
  },
  last_device_used: { lastUsedDeviceName, imageUrl },
}) => {
  const classes = Styles();

  return (
    <Card className={classes.content}>
      <CardContent>
        <Grid container className={classes.titleSection}>
          <Grid item xs={6} sm={6} md={6}>
            <Typography color="textPrimary">{activityName}</Typography>
          </Grid>
          <Grid item xs={6} sm={6} md={6} align="right">
            <Typography className={classes.date} color="textSecondary">
              {new Date(startTimeGMT).toDateString()}
            </Typography>
          </Grid>
        </Grid>
        <Grid container spacing={3}>
          <Grid item xs={6} sm={3} md={3}>
            <Typography color="textSecondary" align="left">
              {aboutStrings.distance}{" "}
            </Typography>
          </Grid>
          <Grid item xs={6} sm={3} md={3} align="right">
            <Typography className={classes.rightPadding}>
              {`${(distance / 1000.0).toLocaleString()} km`}
            </Typography>
          </Grid>
          <Grid item xs={6} sm={3} md={3}>
            <Typography color="textSecondary" className={classes.leftPadding}>
              {aboutStrings.duration}{" "}
            </Typography>
          </Grid>
          <Grid item xs={6} sm={3} md={3} align="right">
            <Typography>
              {`${(duration / 60.0).toLocaleString()} mins`}
            </Typography>
          </Grid>
          <Grid item xs={6} sm={3} md={3}>
            <Typography color="textSecondary">
              {aboutStrings.avgSpeed}{" "}
            </Typography>
          </Grid>
          <Grid item xs={6} sm={3} md={3} align="right">
            <Typography className={classes.rightPadding}>
              {`${(1000.0 / averageSpeed / 60.0)
                .toFixed(2)
                .toLocaleString()} mins/km`}
            </Typography>
          </Grid>
          <Grid item xs={6} sm={3} md={3}>
            <Typography color="textSecondary" className={classes.leftPadding}>
              {aboutStrings.maxSpeed}{" "}
            </Typography>
          </Grid>
          <Grid item xs={6} sm={3} md={3} align="right">
            <Typography>
              {`${(1000.0 / maxSpeed / 60.0)
                .toFixed(2)
                .toLocaleString()} mins/km`}
            </Typography>
          </Grid>
          <Grid item xs={6} sm={3} md={3}>
            <Typography color="textSecondary">
              {aboutStrings.calories}{" "}
            </Typography>
          </Grid>
          <Grid item xs={6} sm={3} md={3} align="right">
            <Typography className={classes.rightPadding}>
              {`${Math.floor(calories).toLocaleString()}`}
            </Typography>
          </Grid>
          <Grid item xs={6} sm={3} md={3}>
            <Typography color="textSecondary" className={classes.leftPadding}>
              {aboutStrings.steps}{" "}
            </Typography>
          </Grid>
          <Grid item xs={6} sm={3} md={3} align="right">
            <Typography>{`${Math.floor(steps).toLocaleString()}`}</Typography>
          </Grid>
          <Grid item xs={6} sm={3} md={3}>
            <Typography color="textSecondary">
              {aboutStrings.averageHr}{" "}
            </Typography>
          </Grid>
          <Grid item xs={6} sm={3} md={3} align="right">
            <Typography className={classes.rightPadding}>
              {`${Math.floor(averageHR).toLocaleString()}`}
            </Typography>
          </Grid>
          <Grid item xs={6} sm={3} md={3}>
            <Typography color="textSecondary" className={classes.leftPadding}>
              {aboutStrings.maxHr}{" "}
            </Typography>
          </Grid>
          <Grid item xs={6} sm={3} md={3} align="right">
            <Typography>{`${Math.floor(maxHR).toLocaleString()}`}</Typography>
          </Grid>
          <Grid item xs={6} sm={4} md={4}>
            <Typography color="textSecondary" className={classes.rightPadding}>
              {aboutStrings.minElevation}{" "}
            </Typography>
          </Grid>
          <Grid item xs={6} sm={2} md={2} align="right">
            <Typography>
              {`${(minElevation / 1000.0).toLocaleString()} km`}
            </Typography>
          </Grid>
          <Grid item xs={6} sm={4} md={4}>
            <Typography color="textSecondary" className={classes.leftPadding}>
              {aboutStrings.maxElevation}{" "}
            </Typography>
          </Grid>
          <Grid item xs={6} sm={2} md={2} align="right">
            <Typography>
              {`${(maxElevation / 1000.0).toLocaleString()} km`}
            </Typography>
          </Grid>
          <Grid item xs={6} sm={4} md={4}>
            <Typography color="textSecondary">
              {aboutStrings.avgStrideLength}{" "}
            </Typography>
          </Grid>
          <Grid item xs={6} sm={2} md={2} align="right">
            <Typography className={classes.rightPadding}>
              {`${Math.floor(avgStrideLength).toLocaleString()} m`}
            </Typography>
          </Grid>
        </Grid>
        <div className={classes.garminImage}>
          <img src={imageUrl} width={200} height={200} alt="garmin" />
          <Typography
            color="textSecondary"
            className={classes.garminText}
          >{`Recorded on ${lastUsedDeviceName}`}</Typography>
        </div>
      </CardContent>
    </Card>
  );
};
