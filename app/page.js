'use client';
import { useState } from "react";
import Axios from "axios";

export default function Home() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [predictedClass, setPredictedClass] = useState(null);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);

        // Create a preview of the selected image
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async () => {
        setLoading(true);
        const formData = new FormData();
        formData.append("file", selectedFile);
 
        try {
            const response = await Axios.post("http://localhost:5000/predict", formData);
            console.log("Success:", response);
            // Replace 0 with, Type A / old houses (Construction period before 1990), Estimated heat demand, 250-400 kWh/m2
            // Replace 1 with, Type B / New constructed houses (Construction after 1990), Estimated heat demand, 150-260 kWh/m2
            // Replace 2 with, Type C / Renovated houses (Construction before 1990 but renovated), Estimated heat demand, 170-210 Wh/m2
            if(response.data == 0)
            setPredictedClass("Type A / old houses (Construction period before 1990), Estimated heat demand, 250-400 kWh/m2");
            else if(response.data == 1)
            setPredictedClass("Type B / New constructed houses (Construction after 1990), Estimated heat demand, 150-260 kWh/m2");
            else if(response.data == 2)
            setPredictedClass("Type C / Renovated houses (Construction before 1990 but renovated), Estimated heat demand, 170-210 Wh/m2");
            else
            setPredictedClass("Error");
            // setPredictedClass(response.data)/;
        } catch (error) {
            console.error("Error occurred:", error);
            // Handle error (e.g., display an error message)
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <input type="file" onChange={handleFileChange} />
            {imagePreview && (
                <img src={imagePreview} alt="Selected" style={{ maxWidth: "100%", maxHeight: 200 }} />
            )}
            <button onClick={handleSubmit} disabled={!selectedFile || loading}>
                {loading ? "Loading..." : "Submit"}
            </button>
            {loading && <p>Loading...</p>}
            {predictedClass && <p>Predicted Class: {predictedClass}</p>}
        </main>
    );
}
