import React, { useState } from 'react'
import { assets } from '../assets/assets_frontend/assets'

// design-system
import Card from '../design-system/components/Card.jsx'
import Button from '../design-system/components/button.jsx'
import Input from '../design-system/components/Input.jsx'
import Badge from '../design-system/components/Badge.jsx'

const ProfilePage = () => {
  const [userData, setUserData] = useState({
    name: 'Edward Vincent',
    image: assets.profile_pic,
    email: 'richardjamewap@gmail.com',
    phone: '+91 9155252399',
    address: {
      line1: '57th Cross, Richmond',
      line2: 'Circle, Church Road, London',
    },
    gender: 'Male',
    dob: '2000-01-01',
  })

  const [isEdit, setIsEdit] = useState(false)

  return (
    <div className="max-w-3xl mx-auto mt-12 px-4">
      <Card>
        <div className="flex flex-col sm:flex-row gap-8">
          {/* Profile Image */}
          <div className="flex flex-col items-center gap-3">
            <img
              src={userData.image}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover bg-indigo-50"
            />

            <Badge variant="success" size="sm">
              Active
            </Badge>
          </div>

          {/* Profile Info */}
          <div className="flex-1 space-y-6">
            {/* Name */}
            {isEdit ? (
              <Input
                label="Full Name"
                value={userData.name}
                onChange={(e) =>
                  setUserData(prev => ({ ...prev, name: e.target.value }))
                }
              />
            ) : (
              <h1 className="text-2xl font-semibold text-gray-900">
                {userData.name}
              </h1>
            )}

            {/* Contact Info */}
            <div>
              <p className="text-sm font-semibold text-gray-900 mb-3">
                Contact Information
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Email"
                  value={userData.email}
                  disabled
                />

                {isEdit ? (
                  <Input
                    label="Phone"
                    value={userData.phone}
                    onChange={(e) =>
                      setUserData(prev => ({
                        ...prev,
                        phone: e.target.value,
                      }))
                    }
                  />
                ) : (
                  <Input
                    label="Phone"
                    value={userData.phone}
                    disabled
                  />
                )}

                {isEdit ? (
                  <Input
                    label="Address Line 1"
                    value={userData.address.line1}
                    onChange={(e) =>
                      setUserData(prev => ({
                        ...prev,
                        address: {
                          ...prev.address,
                          line1: e.target.value,
                        },
                      }))
                    }
                  />
                ) : (
                  <Input
                    label="Address Line 1"
                    value={userData.address.line1}
                    disabled
                  />
                )}

                {isEdit ? (
                  <Input
                    label="Address Line 2"
                    value={userData.address.line2}
                    onChange={(e) =>
                      setUserData(prev => ({
                        ...prev,
                        address: {
                          ...prev.address,
                          line2: e.target.value,
                        },
                      }))
                    }
                  />
                ) : (
                  <Input
                    label="Address Line 2"
                    value={userData.address.line2}
                    disabled
                  />
                )}
              </div>
            </div>

            {/* Personal Info */}
            <div>
              <p className="text-sm font-semibold text-gray-900 mb-3">
                Personal Information
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {isEdit ? (
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-1">
                      Gender
                    </label>
                    <select
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3"
                      value={userData.gender}
                      onChange={(e) =>
                        setUserData(prev => ({
                          ...prev,
                          gender: e.target.value,
                        }))
                      }
                    >
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                  </div>
                ) : (
                  <Input
                    label="Gender"
                    value={userData.gender}
                    disabled
                  />
                )}

                {isEdit ? (
                  <Input
                    label="Date of Birth"
                    type="date"
                    value={userData.dob}
                    onChange={(e) =>
                      setUserData(prev => ({
                        ...prev,
                        dob: e.target.value,
                      }))
                    }
                  />
                ) : (
                  <Input
                    label="Date of Birth"
                    value={userData.dob}
                    disabled
                  />
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4">
              {isEdit ? (
                <Button onClick={() => setIsEdit(false)}>
                  Save Changes
                </Button>
              ) : (
                <Button onClick={() => setIsEdit(true)}>
                  Edit Profile
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default ProfilePage
