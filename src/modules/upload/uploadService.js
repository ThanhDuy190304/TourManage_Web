const supabase = require('../../public/js/supabase'); // Đường dẫn đến file supabase.js


class uploadService {
    static async uploadProfilePicture (fileBuffer, fileType) {
        try {
            const fileExtension = fileType.split('/')[1]; // Lấy phần mở rộng từ mime type
            const filePath = `profile-pictures/${Date.now()}.${fileExtension}`; // Đặt tên file cho Supabase
    
            // Upload file lên Supabase
            const { data, error } = await supabase.storage
                .from('AvatarUser') // Tên bucket Supabase của bạn
                .upload(filePath, fileBuffer, {
                    cacheControl: '3600',
                    upsert: false,
                    contentType: fileType,
                });
            if (error) {
                throw error;
            }
            // Lấy URL của file đã upload
            const { data: publicUrlData } = supabase.storage
                .from('AvatarUser')
                .getPublicUrl(filePath);
                
            return publicUrlData.publicUrl;
        } catch (error) {
            throw new Error(`Lỗi khi upload ảnh lên Supabase: ${error.message}`);
        }
    }
}

module.exports = uploadService