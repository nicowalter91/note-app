import React, { useRef, useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import { useNavigate } from "react-router-dom";
import { createVoronoiFromPoints } from "./utils/canvas-utils.jsx";
import Modal from "react-modal";
import axiosInstance from "../../utils/axiosInstance";
import * as fabric from "fabric";
import Layout from '../../components/Layout/Layout'

const Tactic = () => {
  const [userInfo, setUserInfo] = useState(null); // Zustand für Benutzerdaten
  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });
  const [showToastMsg, setShowToastMsg] = useState({
    isShown: false,
    message: "",
    data: null,
  });

  const canvasRef = useRef(null); // Ref for the canvas DOM element
  const fabricCanvas = useRef(null); // Ref for the Fabric.js canvas instance
  const pointsRef = useRef([]); // Store points for the Voronoi diagram

  const navigate = useNavigate();

  useEffect(() => {
    getUserInfo(); // Benutzerdaten abrufen

    // Initialize Fabric.js canvas
    fabricCanvas.current = new fabric.Canvas(canvasRef.current);

    // Add a circle on canvas click
    const handleMouseDown = (e) => {
      const pointer = fabricCanvas.current.getPointer(e.e);
      const circle = new fabric.Circle({
        left: pointer.x,
        top: pointer.y,
        radius: 5,
        fill: "red",
        hasControls: false,
        hasBorders: false,
      });
      fabricCanvas.current.add(circle);
      pointsRef.current.push({ x: pointer.x, y: pointer.y }); // Store the point
    };

    // Attach event listener to Fabric.js canvas
    fabricCanvas.current.on("mouse:down", handleMouseDown);

    // Cleanup when component unmounts
    return () => {
      fabricCanvas.current.off("mouse:down", handleMouseDown);
      fabricCanvas.current.dispose(); // Dispose the Fabric.js instance
    };
  }, []);

  const handleClick = () => {
    const points = pointsRef.current; // Access the points from the ref
    const canvas = fabricCanvas.current; // Access the canvas instance

    if (points.length === 0) {
      return alert("No points to create a Voronoi diagram!");
    }

    const voronoiDiagram = createVoronoiFromPoints(points, canvas);

    // Clear existing Voronoi lines
    canvas.getObjects("line").forEach((line) => canvas.remove(line));

    // Iterate over Voronoi cells and draw edges
    for (const polygon of voronoiDiagram.cellPolygons()) {
      const vertices = Array.from(polygon);

      // Draw edges of each polygon
      for (let i = 0; i < vertices.length; i++) {
        const [x1, y1] = vertices[i];
        const [x2, y2] = vertices[(i + 1) % vertices.length]; // Wrap around to form a closed polygon

        const line = new fabric.Line([x1, y1, x2, y2], {
          stroke: "blue",
          strokeWidth: 1,
          selectable: false,
        });
        canvas.add(line);
      }
    }
  };

  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/get-user");
      if (response.data && response.data.user) {
        setUserInfo(response.data.user); // Benutzerdaten setzen
      }
    } catch (error) {
      if (error.response.status === 401) {
        localStorage.clear(); // Bei 401 Fehler (unauthorized) den lokalen Speicher löschen
        navigate("/login"); // Zur Login-Seite navigieren
            }
    }
  };

  return (
  <Layout>
      <div className="container mx-auto">
        <div className="grid grid-cols-3 gap-4 mt-8">
          <canvas
            ref={canvasRef}
            id="canvas"
            width="800"
            height="600"
            style={{ border: "1px solid black" }}
          ></canvas>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-8">
          <button
            id="generateVoronoi"
            onClick={handleClick}
            className="btn-primary"
          >
            Generate Voronoi
           </button>
        </div>
      </div> 
  </Layout>
  );
};

export default Tactic;
