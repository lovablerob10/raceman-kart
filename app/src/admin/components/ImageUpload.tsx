import { useState, useRef, useCallback } from 'react';
import { Upload, X, User } from 'lucide-react';

interface ImageUploadProps {
    value?: string;
    onChange: (file: File | null, preview: string | null) => void;
    shape?: 'circle' | 'square';
    size?: 'sm' | 'md' | 'lg';
    placeholder?: string;
}

const sizeClasses = {
    sm: 'w-20 h-20',
    md: 'w-32 h-32',
    lg: 'w-40 h-40',
};

export function ImageUpload({
    value,
    onChange,
    shape = 'circle',
    size = 'md',
    placeholder = 'Arraste uma imagem ou clique para selecionar'
}: ImageUploadProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [preview, setPreview] = useState<string | null>(value || null);
    const [uploadProgress, setUploadProgress] = useState<number | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFile = useCallback((file: File | null) => {
        if (!file) {
            setPreview(null);
            onChange(null, null);
            return;
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Por favor, selecione apenas arquivos de imagem.');
            return;
        }

        // Simulate upload progress
        setUploadProgress(0);
        const interval = setInterval(() => {
            setUploadProgress(prev => {
                if (prev === null || prev >= 100) {
                    clearInterval(interval);
                    return null;
                }
                return prev + 20;
            });
        }, 100);

        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
            const result = e.target?.result as string;
            setPreview(result);
            onChange(file, result);
        };
        reader.readAsDataURL(file);
    }, [onChange]);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        handleFile(file);
    }, [handleFile]);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback(() => {
        setIsDragging(false);
    }, []);

    const handleClick = () => {
        inputRef.current?.click();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        handleFile(file);
    };

    const handleRemove = (e: React.MouseEvent) => {
        e.stopPropagation();
        setPreview(null);
        setUploadProgress(null);
        onChange(null, null);
        if (inputRef.current) {
            inputRef.current.value = '';
        }
    };

    return (
        <div className="flex flex-col items-center gap-4">
            {/* Image Preview / Upload Area */}
            <div
                onClick={handleClick}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`
          relative cursor-pointer overflow-hidden
          ${sizeClasses[size]}
          ${shape === 'circle' ? 'rounded-full' : 'rounded-xl'}
          ${isDragging
                        ? 'border-4 border-[#F5B500] bg-orange-50/5'
                        : 'border-4 border-dashed border-gray-300 bg-gray-50/5 hover:border-[#F5B500] hover:bg-orange-50/5'
                    }
          transition-all duration-200
          flex items-center justify-center
        `}
            >
                {preview ? (
                    <>
                        <img
                            src={preview}
                            alt="Preview"
                            className="w-full h-full object-cover"
                        />
                        {/* Remove button */}
                        <button
                            onClick={handleRemove}
                            className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                        >
                            <X size={14} />
                        </button>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center text-gray-400 p-4">
                        {shape === 'circle' ? (
                            <User size={size === 'lg' ? 48 : size === 'md' ? 36 : 24} />
                        ) : (
                            <Upload size={size === 'lg' ? 48 : size === 'md' ? 36 : 24} />
                        )}
                    </div>
                )}

                {/* Upload Progress */}
                {uploadProgress !== null && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <div className="w-3/4 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-[#F5B500] transition-all duration-200"
                                style={{ width: `${uploadProgress}%` }}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Hidden input */}
            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                onChange={handleChange}
                className="hidden"
            />

            {/* Helper text */}
            {!preview && (
                <p className="text-sm text-gray-500 text-center max-w-[200px]">
                    {placeholder}
                </p>
            )}
        </div>
    );
}

export default ImageUpload;
