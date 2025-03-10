import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/Exercise.css';
import CONFIG from '../config';

const Exercise = () => {
  const { id } = useParams();
  const [exercise, setExercise] = useState(null);
  const [relatedVideos, setRelatedVideos] = useState([]);

  useEffect(() => {
    if (id) {
      fetchData(id);
    }
  }, [id]); // ✅ Fix: Added `id` as a dependency so useEffect runs when ID changes.

  const fetchData = async (id) => {
    const options = {
      method: 'GET',
      url: `https://exercisedb.p.rapidapi.com/exercises/exercise/${id}`,
      headers: {
        'X-RapidAPI-Key': CONFIG.EXERCISE_API_KEY,
        'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com',
      },
    };

    try {
      const response = await axios.request(options);
      console.log(response.data);
      setExercise(response.data);

      fetchRelatedVideos(response.data.name);
    } catch (error) {
      console.error("Exercise API Error:", error);
    }
  };

  const fetchRelatedVideos = async (name) => {
    console.log("Fetching related videos for:", name);

    const options = {
      method: 'GET',
      url: `https://www.googleapis.com/youtube/v3/search`,
      params: {
        q: name,
        part: "snippet",
        maxResults: 5,
        type: "video",
        key: CONFIG.YOUTUBE_API_KEY,
      },
    };

    try {
      const response = await axios.request(options);
      console.log("YouTube API Response:", response.data.items);
      setRelatedVideos(response.data.items || []); // ✅ Fix: Ensure it's always an array
    } catch (error) {
      console.error("YouTube API Error:", error);
      setRelatedVideos([]); // ✅ Fix: Prevent undefined state
    }
  };

  return (
    <div className="exercise-page">
      {exercise && (
        <div className="exercise-container">
          <div className="exercise-image">
            <img src={exercise.gifUrl} alt="exercise img" />
          </div>

          <div className="exercise-data">
            <h3>{exercise.name}</h3>
            <span>
              <b>Target:</b>
              <p>{exercise.target}</p>
            </span>
            <span>
              <b>Equipment:</b>
              <p>{exercise.equipment}</p>
            </span>
            <span>
              <b>Secondary Muscles:</b>
              <ul>
                {exercise.secondaryMuscles.map((muscle, index) => (
                  <li key={index}>{muscle}</li>
                ))}
              </ul>
            </span>
            <div className="exercise-instructions">
              <h3>Instructions</h3>
              <ul>
                {exercise.instructions.map((instruction, index) => (
                  <li key={index}>{instruction}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Fixed JSX Syntax in Related Videos Section */}
      <div className="related-videos-container">
        <h3>Related Videos on Youtube</h3>
        <div className="related-videos">
          {relatedVideos.map((video, index) => {
            if (!video.snippet || !video.snippet.thumbnails) return null; // ✅ Fix: Ensure video.snippet exists

            return (
              <div
                className="related-video"
                key={index}
                onClick={() => window.open(`https://www.youtube.com/watch?v=${video.id.videoId}`, "_blank")}
              >
                <img src={video.snippet.thumbnails.default?.url || ''} alt="Video Thumbnail" />
                <h4>{video.snippet.title ? video.snippet.title.slice(0, 40) + "..." : "No Title"}</h4>
                <span>
                  <p>{video.snippet.channelTitle || "Unknown Channel"}</p>
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Exercise;
