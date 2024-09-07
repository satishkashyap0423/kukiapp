import React, {useState, useRef,useEffect} from 'react';

import ViewShot from "react-native-view-shot";

function Capture (){
  const ref = useRef();

  useEffect(() => {
    // on mount
    ref.current.capture().then(uri => {
      console.log("do something with ", uri);
    });
  }, []);

  return (
    <ViewShot ref={ref} options={{ fileName: "Your-File-Name", format: "jpg", quality: 0.9 }}>
      <Text>...Something to rasterize...</Text>
    </ViewShot>
  );
}
