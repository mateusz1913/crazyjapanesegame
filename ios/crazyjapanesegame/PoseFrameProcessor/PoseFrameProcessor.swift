import Vision
import MLKitVision
import CoreML
import MLKitPoseDetectionAccurate

import UIKit
import AVFoundation

@objc(PoseFrameProcessor)
public class PoseFrameProcessor: NSObject, FrameProcessorPluginBase {
  
  static var poseDetectorOptions: AccuratePoseDetectorOptions = {
    let options = AccuratePoseDetectorOptions()
    options.detectorMode = .stream
    return options
  }()
  
  static var poseDetector = PoseDetector.poseDetector(options: poseDetectorOptions)

  static func parseLandmarkPosition(_ landmark: PoseLandmark) -> [String: CGFloat] {
    return ["x": landmark.position.x, "y": landmark.position.y, "z": landmark.position.z]
  }
  
  @objc public static func callback(_ frame: Frame!, withArgs _: [Any]!) -> Any! {
    let image = VisionImage(buffer: frame.buffer)
    image.orientation = .up
    
    var results: [Pose]?
    do {
      results = try poseDetector.results(in: image)
    } catch let error {
      print("Failed to detect pose with error: \(error.localizedDescription).")
      return []
    }
    guard let detectedPoses = results, !detectedPoses.isEmpty else {
      print("Pose detector returned no results.")
      return []
    }
    
    var poseAttributes: [[String: [String: CGFloat]]] = []
    
    for pose in detectedPoses {
      var map: [String: [String: CGFloat]] = [:]
      let leftAnkleLandmark = pose.landmark(ofType: .leftAnkle)
      let rightAnkleLandmark = pose.landmark(ofType: .rightAnkle)
      let leftKneeLandmark = pose.landmark(ofType: .leftKnee)
      let rightKneeLandmark = pose.landmark(ofType: .rightKnee)
      let leftHipLandmark = pose.landmark(ofType: .leftHip)
      let rightHipLandmark = pose.landmark(ofType: .rightHip)
      let leftWristLandmark = pose.landmark(ofType: .leftWrist)
      let rightWristLandmark = pose.landmark(ofType: .rightWrist)
      let leftElbowLandmark = pose.landmark(ofType: .leftElbow)
      let rightElbowLandmark = pose.landmark(ofType: .rightElbow)
      let leftShoulderLandmark = pose.landmark(ofType: .leftShoulder)
      let rightShoulderLandmark = pose.landmark(ofType: .rightShoulder)
      let leftEyeLandmark = pose.landmark(ofType: .leftEye)
      let rightEyeLandmark = pose.landmark(ofType: .rightEye)
      map["leftAnkle"] = self.parseLandmarkPosition(leftAnkleLandmark)
      map["rightAnkle"] = self.parseLandmarkPosition(rightAnkleLandmark)
      map["leftKnee"] = self.parseLandmarkPosition(leftKneeLandmark)
      map["rightKnee"] = self.parseLandmarkPosition(rightKneeLandmark)
      map["leftHip"] = self.parseLandmarkPosition(leftHipLandmark)
      map["rightHip"] = self.parseLandmarkPosition(rightHipLandmark)
      map["leftWrist"] = self.parseLandmarkPosition(leftWristLandmark)
      map["rightWrist"] = self.parseLandmarkPosition(rightWristLandmark)
      map["leftElbow"] = self.parseLandmarkPosition(leftElbowLandmark)
      map["rightElbow"] = self.parseLandmarkPosition(rightElbowLandmark)
      map["leftShoulder"] = self.parseLandmarkPosition(leftShoulderLandmark)
      map["rightShoulder"] = self.parseLandmarkPosition(rightShoulderLandmark)
      map["leftEye"] = self.parseLandmarkPosition(leftEyeLandmark)
      map["rightEye"] = self.parseLandmarkPosition(rightEyeLandmark)
      poseAttributes.append(map)
    }

    return poseAttributes
  }
}
