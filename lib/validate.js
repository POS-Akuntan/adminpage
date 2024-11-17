// Fungsi untuk memproses input
export function validateUserName(input) {
    input.value = input.value.toLowerCase(); // Convert to lowercase
    input.value = input.value.replace(/\s+/g, ''); // Remove spaces
    input.value = input.value.replace(/[^a-z0-9_-]/gi, ''); // Remove special characters except _ and -
}

// Fungsi validasi nomor telepon
export function validatePhoneNumber(input) {
    // Hanya izinkan angka
    input.value = input.value.replace(/[^0-9]/g, '');
    // Jika karakter pertama adalah 0, hapus karakter tersebut
    if (input.value.length > 1 && input.value.charAt(0) === '0') {
        input.value = '62'+input.value.substr(1);
    }
}