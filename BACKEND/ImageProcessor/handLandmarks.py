import mediapipe as mp
from mediapipe.tasks import python
from mediapipe.tasks.python import vision

import os

model_path = os.path.join(os.path.dirname(__file__), 'models', 'hand_landmarker.task')
print("Model path:", model_path)
baseOptions = mp.tasks.BaseOptions
handLandMarker = mp.tasks.vision.HandLandmarker
handLandMarkerOptions = mp.tasks.vision.HandLandmarkerOptions
visionRunningMode = mp.tasks.vision.RunningMode

options = handLandMarkerOptions(base_options=baseOptions(model_asset_path=model_path),
                                running_mode=visionRunningMode.IMAGE)


with handLandMarker.create_from_options(options) as landmarker:
    hand_path = os.path.join(os.path.dirname(__file__), 'hand.jpg')
    print("Hand path:", hand_path)
    mpImage = mp.Image.create_from_file(hand_path)
    handLandmarkerResult = landmarker.detect(mpImage)
    print(handLandmarkerResult.hand_world_landmarks  )