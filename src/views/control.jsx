import React from "react";
import ReactDOM from "react-dom";
import OnReadyScheduler from "views/utils/scheduler";
import Button from "views/components/button";

const scheduler = new OnReadyScheduler();

scheduler.schedule(() => {
  ReactDOM.render(
    <div>
      <p>Click something:</p>
      <Button msg="first">First thing</Button>
      <Button msg="second">Second thing</Button>
    </div>,
    document.getElementById("root"),
  );
});
