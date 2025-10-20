import { useState } from 'react'
import { Info, Eye, EyeOff } from 'lucide-react'

const AccessKeyInfo = () => {
  const [showKeys, setShowKeys] = useState(false)

  const accessKeys = {
    instructor: 'INSTRUCTOR_KEY_2024',
    admin: 'ADMIN_KEY_2024'
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <div className="flex items-start space-x-3">
        <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="text-sm font-medium text-blue-900 mb-2">
            Access Keys for Registration
          </h3>
          <p className="text-sm text-blue-700 mb-3">
            To register as an instructor or admin, you need the appropriate access key.
          </p>
          
          <button
            onClick={() => setShowKeys(!showKeys)}
            className="flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            {showKeys ? (
              <>
                <EyeOff className="h-4 w-4 mr-1" />
                Hide Access Keys
              </>
            ) : (
              <>
                <Eye className="h-4 w-4 mr-1" />
                Show Access Keys
              </>
            )}
          </button>

          {showKeys && (
            <div className="mt-3 space-y-2">
              <div className="bg-white rounded border p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Instructor Key:</span>
                  <code className="text-sm bg-gray-100 px-2 py-1 rounded font-mono">
                    {accessKeys.instructor}
                  </code>
                </div>
              </div>
              <div className="bg-white rounded border p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Admin Key:</span>
                  <code className="text-sm bg-gray-100 px-2 py-1 rounded font-mono">
                    {accessKeys.admin}
                  </code>
                </div>
              </div>
              <p className="text-xs text-blue-600 mt-2">
                💡 These are development keys. In production, use secure environment variables.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AccessKeyInfo
