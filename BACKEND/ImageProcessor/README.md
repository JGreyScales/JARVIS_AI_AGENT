if you need to compile the openCV run 

```cmake -G "MinGW Makefiles" -D CMAKE_INSTALL_PREFIX=../install -DOPENCV_EXTRA_MODULES_PATH="D:/Programming/JARVIS_AI_AGENT/BACKEND/ImageProcessor/opencv_contrib-4.x/modules" -D CMAKE_BUILD_TYPE=Release "D:/Programming/JARVIS_AI_AGENT/BACKEND/ImageProcessor/opencv-4.12.0"```

Once built install the app running  
```mingw32-make -j20```
```mingw32-make install``` where jx is the amount of threads you want to dedicate to the build process  


to build the project run:  
ENSURE:  
You have added ```BACKEND\Image Processor\OpenCV\OpenCV-MinGW-Build-OpenCV-4.1.1-x64\x64\mingw\bin``` to your system or user path  
to build the command use the ctrl+shift+b combo to run the premade build command
