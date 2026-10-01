import React, { useState, useEffect } from 'react';
import { X, Star, Upload, Calendar, MapPin, FileText, Compass, Loader2 } from 'lucide-react';

const TripModal = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    title: '',
    destination: '',
    startDate: '',
    endDate: '',
    description: '',
    rating: 5,
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        destination: initialData.destination || '',
        startDate: initialData.startDate ? initialData.startDate.split('T')[0] : '',
        endDate: initialData.endDate ? initialData.endDate.split('T')[0] : '',
        description: initialData.description || '',
        rating: initialData.rating || 5,
      });
      setImagePreview(initialData.coverImage || null);
    } else {
      setFormData({
        title: '',
        destination: '',
        startDate: '',
        endDate: '',
        description: '',
        rating: 5,
      });
      setImagePreview(null);
    }
    setImageFile(null);
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const compressAndConvertToBase64 = (file, maxWidth = 1200, maxHeight = 1200, quality = 0.8) => {
    return new Promise((resolve) => {
      if (!file || !file.type || !file.type.startsWith('image/')) {
        return resolve(null);
      }
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          let width = img.width;
          let height = img.height;

          if (width > maxWidth || height > maxHeight) {
            if (width > height) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            } else {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          const dataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(dataUrl);
        };
        img.onerror = () => resolve(event.target.result);
      };
      reader.onerror = () => resolve(null);
    });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const dataUrl = await compressAndConvertToBase64(file);
      if (dataUrl) {
        setImagePreview(dataUrl);
        setImageFile(file);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.startDate && formData.endDate && new Date(formData.endDate) < new Date(formData.startDate)) {
      alert('End date cannot be earlier than start date.');
      return;
    }

    setLoading(true);
    try {
      const payload = { ...formData };
      if (imagePreview) {
        payload.coverImage = imagePreview;
      }
      await onSubmit(payload, imageFile);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="animate-fade-in"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 2000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        background: 'rgba(5, 8, 14, 0.8)',
        backdropFilter: 'blur(12px)',
      }}
      onClick={onClose}
    >
      <div
        className="glass-panel animate-scale-up"
        style={{
          width: '100%',
          maxWidth: '620px',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '2rem',
          background: 'rgba(15, 23, 42, 0.95)',
          border: '1px solid var(--border-glass-hover)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-lg)',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.75rem',
            borderBottom: '1px solid var(--border-glass)',
            paddingBottom: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'var(--gradient-brand)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Compass size={20} color="#fff" />
            </div>
            <h2 style={{ fontSize: '1.4rem', color: 'var(--text-main)', margin: 0 }}>
              {initialData ? 'Edit Destination Memory' : 'Create New Journey'}
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-glass)',
              borderRadius: '50%',
              width: '34px',
              height: '34px',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Cover Image Upload Field */}
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
              Cover Image Photo
            </label>
            <div
              style={{
                position: 'relative',
                height: '140px',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                border: '2px dashed var(--border-glass-hover)',
                background: imagePreview
                  ? `url(${imagePreview}) center/cover no-repeat`
                  : 'rgba(255, 255, 255, 0.03)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'border-color 0.2s ease',
              }}
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{
                  position: 'absolute',
                  inset: 0,
                  opacity: 0,
                  cursor: 'pointer',
                  width: '100%',
                  height: '100%',
                }}
              />
              <div
                style={{
                  background: 'rgba(15, 23, 42, 0.75)',
                  backdropFilter: 'blur(8px)',
                  padding: '0.6rem 1.2rem',
                  borderRadius: 'var(--radius-full)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  color: 'var(--text-main)',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  pointerEvents: 'none',
                  border: '1px solid var(--border-glass)',
                }}
              >
                <Upload size={16} color="var(--accent-primary)" />
                {imagePreview ? 'Change Cover Photo' : 'Upload Cover Photo'}
              </div>
            </div>
          </div>

          {/* Title & Destination */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }} className="form-grid">
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                <Compass size={14} color="var(--accent-primary)" /> Trip Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Kyoto Cherry Blossom Tour"
                className="input-premium"
                required
              />
            </div>
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                <MapPin size={14} color="var(--accent-secondary)" /> Destination *
              </label>
              <input
                type="text"
                name="destination"
                value={formData.destination}
                onChange={handleChange}
                placeholder="e.g. Kyoto, Japan"
                className="input-premium"
                required
              />
            </div>
          </div>

          {/* Dates */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }} className="form-grid">
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                <Calendar size={14} color="var(--accent-cyan)" /> Start Date
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="input-premium"
              />
            </div>
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                <Calendar size={14} color="var(--accent-amber)" /> End Date
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="input-premium"
              />
            </div>
          </div>

          {/* Rating */}
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
              Experience Rating (1-5)
            </label>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFormData({ ...formData, rating: star })}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '0.2rem',
                    transition: 'transform 0.15s ease',
                    transform: (hoverRating || formData.rating) >= star ? 'scale(1.15)' : 'scale(1)',
                  }}
                >
                  <Star
                    size={24}
                    fill={(hoverRating || formData.rating) >= star ? '#fbbf24' : 'transparent'}
                    color={(hoverRating || formData.rating) >= star ? '#fbbf24' : 'var(--text-subtle)'}
                  />
                </button>
              ))}
              <span style={{ fontSize: '0.9rem', color: 'var(--accent-amber)', fontWeight: 700, marginLeft: '0.5rem' }}>
                {formData.rating} / 5 Stars
              </span>
            </div>
          </div>

          {/* Description */}
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
              <FileText size={14} /> Travel Journal Notes
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              placeholder="Record highlight moments, favorite spots, culinary discoveries..."
              className="input-premium"
              style={{ resize: 'vertical' }}
            />
          </div>

          {/* Submit Action */}
          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.75rem' }}>
            <button
              type="button"
              onClick={onClose}
              className="btn-glass"
              style={{ flex: 1, justifyContent: 'center' }}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-premium"
              style={{ flex: 2, justifyContent: 'center' }}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Saving Journey...
                </>
              ) : initialData ? (
                'Update Trip'
              ) : (
                'Save to Vault'
              )}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        @media (max-width: 540px) {
          .form-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};

export default TripModal;
