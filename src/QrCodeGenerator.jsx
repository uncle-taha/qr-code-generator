import { useState, useEffect } from "react";
import QRCode from "qrcode";

export default function QRCodeGenerator() {
  const [input, setInput] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [error, setError] = useState("");

  // Validate input: only uppercase letters and numbers, max 12 characters
  const validateInput = (value) => {
    // Remove any invalid characters and convert to uppercase
    const cleaned = value.replace(/[^A-Z0-9]/g, "").toUpperCase();
    // Limit to 12 characters
    return cleaned.slice(0, 12);
  };

  const handleInputChange = (e) => {
    const value = e.target.value.toUpperCase();
    const validatedValue = validateInput(value);
    setInput(validatedValue);

    // Clear previous errors
    setError("");

    // Validate length
    if (validatedValue.length > 0 && validatedValue.length < 12) {
      setError(
        `Enter exactly 12 characters (current: ${validatedValue.length})`
      );
    }
  };

  // Generate QR code when input is valid
  useEffect(() => {
    if (input.length === 12) {
      QRCode.toDataURL(input, {
        width: 256,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      })
        .then((url) => {
          setQrCodeUrl(url);
          setError("");
        })
        .catch((err) => {
          console.error("Error generating QR code:", err);
          setError("Failed to generate QR code");
        });
    } else {
      setQrCodeUrl("");
    }
  }, [input]);

  const isValid = input.length === 12;
  const isEmpty = input.length === 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            QR Code Generator
          </h1>
          <p className="text-gray-600">
            Generate QR codes with 12-character alphanumeric codes
          </p>
        </div>

        {/* Input Card */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">
            Enter Your Code
          </h2>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="code-input"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Code (12 characters, letters and numbers only)
              </label>
              <input
                id="code-input"
                type="text"
                value={input}
                onChange={handleInputChange}
                placeholder="T2020000PPPP"
                maxLength={12}
                className={`w-full px-3 py-3 text-lg font-mono tracking-wider border-2 rounded-md outline-none transition-colors ${
                  error && !isEmpty
                    ? "border-red-500 focus:border-red-500"
                    : isValid
                    ? "border-green-500 focus:border-green-600"
                    : "border-gray-300 focus:border-blue-500"
                }`}
              />
              <div className="flex justify-between mt-2 text-sm">
                <span className="text-gray-500">
                  Only uppercase letters (A-Z) and numbers (0-9)
                </span>
                <span
                  className={`font-medium ${
                    input.length === 12 ? "text-green-600" : "text-gray-500"
                  }`}
                >
                  {input.length}/12
                </span>
              </div>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <div className="flex items-center gap-2 text-red-700">
                  <span className="text-lg">⚠️</span>
                  <span>{error}</span>
                </div>
              </div>
            )}

            {/* Success Alert */}
            {isValid && (
              <div className="bg-green-50 border border-green-200 rounded-md p-3">
                <div className="flex items-center gap-2 text-green-700">
                  <span className="text-lg">✅</span>
                  <span>Code is valid! QR code generated successfully.</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* QR Code Display */}
        {qrCodeUrl && (
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">
              Generated QR Code
            </h2>

            <div className="flex flex-col items-center space-y-4">
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <img
                  src={qrCodeUrl || "/placeholder.svg"}
                  alt={`QR Code for ${input}`}
                  className="w-64 h-64 block"
                />
              </div>

              <div className="text-center space-y-2">
                <p className="text-sm text-gray-600">
                  When scanned, this QR code will display:
                </p>
                <p className="font-mono text-lg font-semibold bg-gray-100 px-4 py-2 rounded-md border border-gray-200">
                  {input}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Placeholder when no QR code */}
        {!qrCodeUrl && !isEmpty && (
          <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
            <div className="text-center text-gray-500">
              <div className="w-64 h-64 mx-auto border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center p-4">
                <p className="text-center">
                  QR code will appear here when you enter 12 valid characters
                </p>
              </div>
            </div>
          </div>
        )}
        <p className="text-center text-yellow-600">
          Example code is for solving delivery pickup problem. Character length
          is adjustable.
        </p>
      </div>
    </div>
  );
}
