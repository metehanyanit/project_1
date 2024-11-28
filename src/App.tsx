import React from 'react';
import { FileUpload } from './components/FileUpload';
import { Chat } from './components/Chat';
import { Dashboard } from './components/Dashboard';
import { useStore } from './store/useStore';
import { Loader2, Dice6 } from 'lucide-react';

function App() {
  const { isProcessing, data } = useStore();

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center gap-8">
          {/* Header */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Dice6 className="w-8 h-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900">D&D Data Assistant</h1>
            </div>
            <p className="text-gray-600">Upload your D&D data and start exploring!</p>
          </div>

          {/* File Upload */}
          <FileUpload />

          {/* Processing Status */}
          {isProcessing && (
            <div className="flex items-center gap-2 text-blue-600">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Processing data...</span>
            </div>
          )}

          {/* Data Status */}
          {data.length > 0 && (
            <div className="text-sm text-gray-600">
              {data.length} items processed and ready for analysis
            </div>
          )}

          {/* Dashboard */}
          <Dashboard />

          {/* Chat Interface */}
          <Chat />
        </div>
      </div>
    </div>
  );
}

export default App;