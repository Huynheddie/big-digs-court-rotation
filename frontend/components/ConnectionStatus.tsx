import React from 'react';
import { motion } from 'framer-motion';
import { useVolleyballApi } from '../hooks/useVolleyballApi';

export const ConnectionStatus: React.FC = () => {
  const { isConnected, isLoading, error, checkHealth } = useVolleyballApi();

  const handleHealthCheck = async () => {
    const isHealthy = await checkHealth();
    console.log('Backend health check:', isHealthy ? 'OK' : 'Failed');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-4 left-4 z-50"
    >
      <div className="bg-white rounded-lg shadow-lg border p-3 min-w-[200px]">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-gray-700">Backend Status</h3>
          <button
            onClick={handleHealthCheck}
            className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition-colors"
          >
            Check
          </button>
        </div>
        
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-xs text-gray-600">
              WebSocket: {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isLoading ? 'bg-yellow-500' : 'bg-gray-400'}`} />
            <span className="text-xs text-gray-600">
              API: {isLoading ? 'Loading...' : 'Ready'}
            </span>
          </div>
        </div>

        {error && (
          <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
            Error: {error}
          </div>
        )}
      </div>
    </motion.div>
  );
}; 