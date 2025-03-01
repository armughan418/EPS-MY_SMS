import React from "react";

function AlertDialog({ title, description, onConfirm, onCancel }) {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-md shadow-lg">
                <h2 className="text-lg font-semibold">{title}</h2>
                <p className="text-gray-600">{description}</p>
                <div className="mt-4 flex justify-end space-x-4">
                    <button onClick={onCancel} className="px-4 py-2 bg-gray-300 rounded">
                        Cancel
                    </button>
                    <button onClick={onConfirm} className="px-4 py-2 bg-blue-900 text-white rounded">
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AlertDialog;
