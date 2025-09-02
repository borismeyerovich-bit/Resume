"use client";

import { useState } from 'react';
import { PersonalInfo, WorkExperience, Education, OtherSection } from '../../entities/Resume';
import { FontSizingConfig } from '../../utils/fontSizing';

interface SectionEditorProps {
  type: 'personal_info' | 'work_experience' | 'education' | 'other' | 'summary' | 'skills';
  data: any;
  onUpdate: (data: any) => void;
  onDelete?: () => void;
  fontConfig: FontSizingConfig;
}

export default function SectionEditor({ type, data, onUpdate, onDelete, fontConfig }: SectionEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(data);

  const handleSave = () => {
    onUpdate(editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData(data);
    setIsEditing(false);
  };

  const handleAddBullet = () => {
    if (type === 'work_experience') {
      setEditData({
        ...editData,
        bullets: [...editData.bullets, '']
      });
    } else if (type === 'other') {
      setEditData({
        ...editData,
        items: [...editData.items, '']
      });
    }
  };

  const handleRemoveBullet = (index: number) => {
    if (type === 'work_experience') {
      const newBullets = editData.bullets.filter((_: any, i: number) => i !== index);
      setEditData({ ...editData, bullets: newBullets });
    } else if (type === 'other') {
      const newItems = editData.items.filter((_: any, i: number) => i !== index);
      setEditData({ ...editData, items: newItems });
    }
  };

  const handleBulletChange = (index: number, value: string) => {
    if (type === 'work_experience') {
      const newBullets = [...editData.bullets];
      newBullets[index] = value;
      setEditData({ ...editData, bullets: newBullets });
    } else if (type === 'other') {
      const newItems = [...editData.items];
      newItems[index] = value;
      setEditData({ ...editData, items: newItems });
    }
  };

  const renderPersonalInfo = () => {
    if (isEditing) {
      return (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={editData.name || ''}
                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={editData.email || ''}
                onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="tel"
                value={editData.phone || ''}
                onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                type="text"
                value={editData.location || ''}
                onChange={(e) => setEditData({ ...editData, location: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="text-center mb-3">
        <h1 
          className="font-bold text-gray-900 mb-2"
          style={{ 
            fontSize: `${fontConfig.headerFontSize}px`,
            lineHeight: `${fontConfig.lineHeight}px`
          }}
        >
          {data.name || 'Your Name'}
        </h1>
        <div 
          className="flex flex-wrap justify-center gap-3 text-gray-600"
          style={{ 
            fontSize: `${fontConfig.bodyFontSize}px`,
            lineHeight: `${fontConfig.lineHeight}px`
          }}
        >
          {data.phone && <span>{data.phone}</span>}
          {data.email && <span>{data.email}</span>}
          {data.location && <span>{data.location}</span>}
        </div>
      </div>
    );
  };

  const renderSummary = () => {
    if (isEditing) {
      return (
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Professional Summary</label>
            <textarea
              value={editData || ''}
              onChange={(e) => setEditData(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="mb-3">
        <p 
          className="text-gray-700 leading-relaxed"
          style={{ 
            fontSize: `${fontConfig.bodyFontSize}px`,
            lineHeight: `${fontConfig.lineHeight}px`
          }}
        >
          {data || 'Add your professional summary here...'}
        </p>
      </div>
    );
  };

  const renderWorkExperience = () => {
    if (isEditing) {
      return (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
              <input
                type="text"
                value={editData.position || ''}
                onChange={(e) => setEditData({ ...editData, position: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
              <input
                type="text"
                value={editData.company || ''}
                onChange={(e) => setEditData({ ...editData, company: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input
                type="text"
                value={editData.startDate || ''}
                onChange={(e) => setEditData({ ...editData, startDate: e.target.value })}
                placeholder="MM/YYYY"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input
                type="text"
                value={editData.endDate || ''}
                onChange={(e) => setEditData({ ...editData, endDate: e.target.value })}
                placeholder="MM/YYYY or Present"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Achievements</label>
            {editData.bullets?.map((bullet: string, index: number) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <input
                  type="text"
                  value={bullet}
                  onChange={(e) => handleBulletChange(index, e.target.value)}
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  onClick={() => handleRemoveBullet(index)}
                  className="px-2 py-2 text-red-600 hover:text-red-800 text-sm"
                >
                  ×
                </button>
              </div>
            ))}
            <button
              onClick={handleAddBullet}
              className="px-3 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700"
            >
              + Add Achievement
            </button>
          </div>

          <div className="flex justify-end space-x-2">
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="mb-3">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 
              className="font-semibold text-gray-900"
              style={{ 
                fontSize: `${fontConfig.bodyFontSize}px`,
                lineHeight: `${fontConfig.lineHeight}px`
              }}
            >
              {data.position || 'Position'}
            </h3>
            <p 
              className="text-gray-600"
              style={{ 
                fontSize: `${fontConfig.bodyFontSize}px`,
                lineHeight: `${fontConfig.lineHeight}px`
              }}
            >
              {data.company || 'Company'}
            </p>
          </div>
          <div className="text-right">
            <p 
              className="text-gray-600"
              style={{ 
                fontSize: `${fontConfig.bodyFontSize}px`,
                lineHeight: `${fontConfig.lineHeight}px`
              }}
            >
              {data.startDate || 'Start'} – {data.endDate || 'End'}
            </p>
            {data.current && <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Current</span>}
          </div>
        </div>
        <div 
          className="ml-4 space-y-1"
          style={{ 
            fontSize: `${fontConfig.bulletFontSize}px`,
            lineHeight: `${fontConfig.lineHeight}px`
          }}
        >
          {data.bullets?.map((bullet: string, index: number) => (
            <div key={index} className="text-gray-700">• {bullet}</div>
          ))}
        </div>
      </div>
    );
  };

  const renderEducation = () => {
    if (isEditing) {
      return (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Degree</label>
              <input
                type="text"
                value={editData.degree || ''}
                onChange={(e) => setEditData({ ...editData, degree: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Institution</label>
              <input
                type="text"
                value={editData.institution || ''}
                onChange={(e) => setEditData({ ...editData, institution: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Field</label>
              <input
                type="text"
                value={editData.field || ''}
                onChange={(e) => setEditData({ ...editData, field: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Graduation Date</label>
              <input
                type="text"
                value={editData.graduationDate || ''}
                onChange={(e) => setEditData({ ...editData, graduationDate: e.target.value })}
                placeholder="YYYY"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="mb-3">
        <h3 
          className="font-semibold text-gray-900"
          style={{ 
            fontSize: `${fontConfig.bodyFontSize}px`,
            lineHeight: `${fontConfig.lineHeight}px`
          }}
        >
          {data.degree || 'Degree'}
        </h3>
        <p 
          className="text-gray-600"
          style={{ 
            fontSize: `${fontConfig.bodyFontSize}px`,
            lineHeight: `${fontConfig.lineHeight}px`
          }}
        >
          {data.institution || 'Institution'}
        </p>
        <p 
          className="text-gray-500"
          style={{ 
            fontSize: `${fontConfig.bodyFontSize}px`,
            lineHeight: `${fontConfig.lineHeight}px`
          }}
        >
          {data.field || 'Field'}
        </p>
        <p 
          className="text-gray-600"
          style={{ 
            fontSize: `${fontConfig.bodyFontSize}px`,
            lineHeight: `${fontConfig.lineHeight}px`
          }}
        >
          {data.graduationDate || 'Graduation Date'}
        </p>
        {data.gpa && (
          <p 
            className="text-gray-600"
            style={{ 
              fontSize: `${fontConfig.bodyFontSize}px`,
              lineHeight: `${fontConfig.lineHeight}px`
            }}
          >
            GPA: {data.gpa}
          </p>
        )}
      </div>
    );
  };

  const renderSkills = () => {
    if (isEditing) {
      return (
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Technical Skills</label>
            <textarea
              value={Array.isArray(editData) ? editData.join(', ') : editData || ''}
              onChange={(e) => setEditData(e.target.value.split(', ').filter(skill => skill.trim()))}
              rows={3}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter skills separated by commas"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="mb-3">
        <h2 
          className="font-semibold text-gray-900 mb-2"
          style={{ 
            fontSize: `${fontConfig.bodyFontSize}px`,
            lineHeight: `${fontConfig.lineHeight}px`
          }}
        >
          Technical Skills
        </h2>
        <div className="flex flex-wrap gap-2">
          {Array.isArray(data) ? data.map((skill: string, index: number) => (
            <span 
              key={index} 
              className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm"
              style={{ 
                fontSize: `${fontConfig.bulletFontSize}px`,
                lineHeight: `${fontConfig.lineHeight}px`
              }}
            >
              {skill}
            </span>
          )) : (
            <span 
              className="text-gray-700"
              style={{ 
                fontSize: `${fontConfig.bodyFontSize}px`,
                lineHeight: `${fontConfig.lineHeight}px`
              }}
            >
              {data || 'Add your technical skills here...'}
            </span>
          )}
        </div>
      </div>
    );
  };

  const renderOther = () => {
    if (isEditing) {
      return (
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              value={editData.title || ''}
              onChange={(e) => setEditData({ ...editData, title: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Items</label>
            {editData.items?.map((item: string, index: number) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => handleBulletChange(index, e.target.value)}
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  onClick={() => handleRemoveBullet(index)}
                  className="px-2 py-2 text-red-600 hover:text-red-800 text-sm"
                >
                  ×
                </button>
              </div>
            ))}
            <button
              onClick={handleAddBullet}
              className="px-3 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700"
            >
              + Add Item
            </button>
          </div>

          <div className="flex justify-end space-x-2">
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="mb-3">
        <h3 
          className="font-semibold text-gray-900"
          style={{ 
            fontSize: `${fontConfig.bodyFontSize}px`,
            lineHeight: `${fontConfig.lineHeight}px`
          }}
        >
          {data.title || 'Section Title'}
        </h3>
        <div 
          className="ml-4 space-y-1"
          style={{ 
            fontSize: `${fontConfig.bulletFontSize}px`,
            lineHeight: `${fontConfig.lineHeight}px`
          }}
        >
          {data.items?.map((item: string, index: number) => (
            <div key={index} className="text-gray-700">• {item}</div>
          ))}
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (type) {
      case 'personal_info':
        return renderPersonalInfo();
      case 'summary':
        return renderSummary();
      case 'work_experience':
        return renderWorkExperience();
      case 'education':
        return renderEducation();
      case 'skills':
        return renderSkills();
      case 'other':
        return renderOther();
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex justify-between items-center mb-3">
        {type !== 'personal_info' && type !== 'summary' && type !== 'skills' && (
          <h2 
            className="font-semibold text-gray-900"
            style={{ 
              fontSize: `${fontConfig.bodyFontSize}px`,
              lineHeight: `${fontConfig.lineHeight}px`
            }}
          >
            {type === 'work_experience' ? 'Experience' : 
             type === 'education' ? 'Education' : 
             type === 'other' ? 'Additional Information' : 'Section'}
          </h2>
        )}
        <div className="flex space-x-2">
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
            >
              Edit
            </button>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              className="px-3 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700"
            >
              ×
            </button>
          )}
        </div>
      </div>
      {renderContent()}
    </div>
  );
}
