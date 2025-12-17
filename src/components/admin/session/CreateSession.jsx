import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'
import { X, Copy, Check, Link as LinkIcon, Calendar as CalendarIcon, Clock, User, Mail, Phone, MapPin, Edit3 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { http } from '../../../axios/axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../../context/ThemeContext'

const statesWithCities = {
  "California": ["Los Angeles", "San Francisco", "San Diego"],
  "Texas": ["Houston", "Dallas", "Austin"],
  "New York": ["New York City", "Buffalo", "Rochester"],
  // Add more states as needed
}

const CreateSession = ({ isOpen, onClose }) => {
  const { theme } = useTheme()
  const { 
    register, 
    handleSubmit, 
    reset, 
    watch,
    formState: { errors }
  } = useForm()
  const selectedState = watch('state')
  const navigate = useNavigate()

  const [copied, setCopied] = useState(false)
  const [sessionLink, setSessionLink] = useState(null)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Theme classes
  const themeClasses = {
    light: {
      bg: 'bg-white',
      text: 'text-gray-900',
      secondaryText: 'text-gray-500',
      border: 'border-gray-200',
      inputBg: 'bg-white',
      hover: 'hover:bg-gray-50',
      cardBg: 'bg-gray-50',
      errorBorder: 'border-red-300',
      errorText: 'text-red-600',
      button: 'bg-blue-600 hover:bg-blue-700',
      cancelButton: 'border-gray-300 text-gray-700 hover:bg-gray-50',
      successBg: 'bg-green-100',
      successText: 'text-green-600',
      linkText: 'text-blue-600',
      linkHover: 'hover:bg-gray-100',
    },
    dark: {
      bg: 'bg-gray-800',
      text: 'text-gray-100',
      secondaryText: 'text-gray-400',
      border: 'border-gray-700',
      inputBg: 'bg-gray-700',
      hover: 'hover:bg-gray-700',
      cardBg: 'bg-gray-900',
      errorBorder: 'border-red-500',
      errorText: 'text-red-400',
      button: 'bg-blue-700 hover:bg-blue-600',
      cancelButton: 'border-gray-600 text-gray-300 hover:bg-gray-700',
      successBg: 'bg-green-900',
      successText: 'text-green-400',
      linkText: 'text-blue-400',
      linkHover: 'hover:bg-gray-700',
    }
  }

  const currentTheme = themeClasses[theme] || themeClasses.light

  const handleCopy = () => {
    navigator.clipboard.writeText(sessionLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast.success('Link copied to clipboard!')
  }

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    try {
      const response = await http.post("/createsession", data)
      if (response.data.success) {
        const roomLink = response.data.data.sessionLink
        const roomName = roomLink.split('/').pop()
        
        setSessionLink(roomLink)
        setShowSuccessModal(true)
        toast.success(response.data.message || "Session created successfully!")
        reset()
        
        // Navigate to session room
        navigate(`/session/${roomName}`)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create session")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      {/* Main Form Modal */}
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={onClose}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
          </Transition.Child>
          
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className={`w-full max-w-2xl transform overflow-hidden rounded-2xl p-6 shadow-xl transition-all ${currentTheme.bg} ${currentTheme.border} border`}>
                  {/* Header */}
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <Dialog.Title className={`text-2xl font-bold ${currentTheme.text}`}>
                        Create New Session
                      </Dialog.Title>
                      <p className={`text-sm mt-1 ${currentTheme.secondaryText}`}>
                        Fill in the details to schedule a new session
                      </p>
                    </div>
                    <button 
                      onClick={onClose}
                      className={`p-1 rounded-full ${currentTheme.hover} transition-colors`}
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Client Information */}
                      <div className="space-y-4">
                        <h3 className={`text-sm font-semibold uppercase tracking-wider ${currentTheme.secondaryText}`}>
                          Client Details
                        </h3>
                        
                        <div>
                          <label className={`text-sm font-medium mb-1 flex items-center ${currentTheme.text}`}>
                            <User className="w-4 h-4 mr-2" />
                            Full Name
                          </label>
                          <input
                            {...register('clientname', { required: "Client name is required" })}
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${currentTheme.inputBg} ${
                              errors.clientname ? currentTheme.errorBorder : currentTheme.border
                            }`}
                            placeholder="John Doe"
                          />
                          {errors.clientname && (
                            <p className={`mt-1 text-sm ${currentTheme.errorText}`}>
                              {errors.clientname.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className={`text-sm font-medium mb-1 flex items-center ${currentTheme.text}`}>
                            <Mail className="w-4 h-4 mr-2" />
                            Email Address
                          </label>
                          <input
                            type="email"
                            {...register('clientemail', { 
                              required: "Email is required",
                              pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: "Invalid email address"
                              }
                            })}
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${currentTheme.inputBg} ${
                              errors.clientemail ? currentTheme.errorBorder : currentTheme.border
                            }`}
                            placeholder="client@example.com"
                          />
                          {errors.clientemail && (
                            <p className={`mt-1 text-sm ${currentTheme.errorText}`}>
                              {errors.clientemail.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className={`text-sm font-medium mb-1 flex items-center ${currentTheme.text}`}>
                            <Phone className="w-4 h-4 mr-2" />
                            Phone Number
                          </label>
                          <input
                            {...register('contactno', { 
                              required: "Phone number is required",
                              pattern: {
                                value: /^[0-9]{10,15}$/,
                                message: "Invalid phone number"
                              }
                            })}
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${currentTheme.inputBg} ${
                              errors.contactno ? currentTheme.errorBorder : currentTheme.border
                            }`}
                            placeholder="1234567890"
                          />
                          {errors.contactno && (
                            <p className={`mt-1 text-sm ${currentTheme.errorText}`}>
                              {errors.contactno.message}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Session Details */}
                      <div className="space-y-4">
                        <h3 className={`text-sm font-semibold uppercase tracking-wider ${currentTheme.secondaryText}`}>
                          Session Details
                        </h3>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className={`text-sm font-medium mb-1 flex items-center ${currentTheme.text}`}>
                              <CalendarIcon className="w-4 h-4 mr-2" />
                              Date
                            </label>
                            <input
                              type="date"
                              {...register('date', { required: "Date is required" })}
                              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${currentTheme.inputBg} ${
                                errors.date ? currentTheme.errorBorder : currentTheme.border
                              }`}
                            />
                            {errors.date && (
                              <p className={`mt-1 text-sm ${currentTheme.errorText}`}>
                                {errors.date.message}
                              </p>
                            )}
                          </div>

                          <div>
                            <label className={`text-sm font-medium mb-1 flex items-center ${currentTheme.text}`}>
                              <Clock className="w-4 h-4 mr-2" />
                              Time
                            </label>
                            <input
                              type="time"
                              {...register('time', { required: "Time is required" })}
                              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${currentTheme.inputBg} ${
                                errors.time ? currentTheme.errorBorder : currentTheme.border
                              }`}
                            />
                            {errors.time && (
                              <p className={`mt-1 text-sm ${currentTheme.errorText}`}>
                                {errors.time.message}
                              </p>
                            )}
                          </div>
                        </div>

                        <div>
                          <label className={`text-sm font-medium mb-1 flex items-center ${currentTheme.text}`}>
                            <MapPin className="w-4 h-4 mr-2" />
                            Location
                          </label>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <select
                                {...register('state', { required: "State is required" })}
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${currentTheme.inputBg} ${
                                  errors.state ? currentTheme.errorBorder : currentTheme.border
                                }`}
                              >
                                <option value="">Select State</option>
                                {Object.keys(statesWithCities).map((state) => (
                                  <option key={state} value={state}>{state}</option>
                                ))}
                              </select>
                              {errors.state && (
                                <p className={`mt-1 text-sm ${currentTheme.errorText}`}>
                                  {errors.state.message}
                                </p>
                              )}
                            </div>
                            <div>
                              <select
                                {...register('city', { required: "City is required" })}
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${currentTheme.inputBg} ${
                                  errors.city ? currentTheme.errorBorder : currentTheme.border
                                }`}
                                disabled={!selectedState}
                              >
                                <option value="">{selectedState ? "Select City" : "Select State First"}</option>
                                {selectedState && statesWithCities[selectedState].map((city) => (
                                  <option key={city} value={city}>{city}</option>
                                ))}
                              </select>
                              {errors.city && (
                                <p className={`mt-1 text-sm ${currentTheme.errorText}`}>
                                  {errors.city.message}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Agent Details */}
                    <div className="space-y-4">
                      <h3 className={`text-sm font-semibold uppercase tracking-wider ${currentTheme.secondaryText}`}>
                        Agent Details (Optional)
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className={`block text-sm font-medium mb-1 ${currentTheme.text}`}>
                            Agent Name
                          </label>
                          <input
                            {...register('agentname')}
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${currentTheme.inputBg} ${currentTheme.border}`}
                            placeholder="Agent name"
                          />
                        </div>
                        <div>
                          <label className={`block text-sm font-medium mb-1 ${currentTheme.text}`}>
                            Agent Email
                          </label>
                          <input
                            type="email"
                            {...register('agentemail')}
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${currentTheme.inputBg} ${currentTheme.border}`}
                            placeholder="agent@example.com"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Session Reason */}
                    <div>
                      <label className={`text-sm font-medium mb-1 flex items-center ${currentTheme.text}`}>
                        <Edit3 className="w-4 h-4 mr-2" />
                        Session Reason
                      </label>
                      <textarea
                        {...register('sessionReason', { required: "Reason is required" })}
                        rows={3}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${currentTheme.inputBg} ${
                          errors.sessionReason ? currentTheme.errorBorder : currentTheme.border
                        }`}
                        placeholder="Describe the purpose of this session..."
                      />
                      {errors.sessionReason && (
                        <p className={`mt-1 text-sm ${currentTheme.errorText}`}>
                          {errors.sessionReason.message}
                        </p>
                      )}
                    </div>

                    {/* Form Actions */}
                    <div className="flex justify-end space-x-3 pt-4">
                      <button
                        type="button"
                        onClick={onClose}
                        className={`px-4 py-2 border rounded-lg transition-colors ${currentTheme.cancelButton}`}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`px-6 py-2 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed ${currentTheme.button}`}
                      >
                        {isSubmitting ? 'Creating...' : 'Create Session'}
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Success Modal */}
      <Transition appear show={showSuccessModal} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setShowSuccessModal(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className={`w-full max-w-md transform overflow-hidden rounded-2xl p-6 text-center shadow-xl transition-all ${currentTheme.bg} ${currentTheme.border} border`}>
                  <div className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full ${currentTheme.successBg}`}>
                    <Check className={`h-6 w-6 ${currentTheme.successText}`} />
                  </div>
                  <Dialog.Title className={`mt-3 text-xl font-bold ${currentTheme.text}`}>
                    Session Created Successfully!
                  </Dialog.Title>
                  <div className="mt-4">
                    <p className={`text-sm ${currentTheme.secondaryText}`}>
                      Your session has been scheduled. Share this link with participants:
                    </p>
                    <div className={`mt-4 p-3 rounded-lg ${currentTheme.cardBg}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center truncate">
                          <LinkIcon className="h-4 w-4 mr-2" />
                          <a
                            href={sessionLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`text-sm ${currentTheme.linkText} hover:underline truncate`}
                          >
                            {sessionLink}
                          </a>
                        </div>
                        <button
                          onClick={handleCopy}
                          className={`ml-2 p-1 rounded-md ${currentTheme.linkHover}`}
                          title="Copy to clipboard"
                        >
                          {copied ? (
                            <Check className={`h-4 w-4 ${currentTheme.successText}`} />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6">
                    <button
                      type="button"
                      onClick={() => setShowSuccessModal(false)}
                      className={`inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors ${currentTheme.button}`}
                    >
                      Close
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}

export default CreateSession