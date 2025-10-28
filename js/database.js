// Đây là tệp giả lập cơ sở dữ liệu của bạn.
// Trong một ứng dụng thật, dữ liệu này sẽ được lấy từ máy chủ (backend).

const productDatabase = {
    "SPALCH": {
        id: "SPALCH",
        title: "Alchemised - Paperback",
        supplier: "Penguin Books",
        author: "SenLinYu",
        publisher: "Del Rey",
        binding: "Bìa Mềm",
        category: "fiction", // <-- Quan trọng
        reviewCount: 0,
        soldCount: 37,
        currentPrice: 626000,
        oldPrice: 696000,
        discount: 10,
        mainImage: "https://placehold.co/300x450/B2EBF2/000000?text=Bìa+Sách",
        thumbnails: [
            "https://placehold.co/80x120/B2EBF2/000000?text=Bìa+1",
            "https://placehold.co/80x120/FFCDD2/000000?text=Bìa+2"
        ],
        sku: "9798217091256",
        releaseDate: "25/10/2025",
        year: 2025,
        pages: 1040,
        description: "In this riveting dark fantasy debut..."
    },
    "SPHARRY": {
        id: "SPHARRY",
        title: "Harry Potter and the Sorcerer's Stone",
        supplier: "Bloomsbury",
        author: "J.K. Rowling",
        publisher: "Scholastic",
        binding: "Bìa Cứng",
        category: "fiction", // <-- Quan trọng
        reviewCount: 1520,
        soldCount: 8900,
        currentPrice: 350000,
        oldPrice: 400000,
        discount: 13,
        mainImage: "https://placehold.co/300x450/E57373/FFFFFF?text=Harry+Potter",
        thumbnails: [
            "https://placehold.co/80x120/E57373/FFFFFF?text=Harry+1",
            "https://placehold.co/80x120/FFEB3B/000000?text=Harry+2"
        ],
        sku: "9780747532743",
        releaseDate: "26/06/1997",
        year: 1997,
        pages: 309,
        description: "Harry Potter has no idea how famous he is..."
    },
    "SPKYNANG": {
        id: "SPKYNANG",
        title: "7 Cảm Xúc (Bìa Cứng)",
        author: "Liz Fosslien & Mollie West Duffy",
        category: "kynangsong", // <-- Quan trọng
        currentPrice: 169000,
        oldPrice: 199000,
        discount: 15,
        mainImage: "img/8935325012006.jpg", // Sử dụng ảnh bạn đã tải lên
        thumbnails: ["img/8935325012006.jpg"]
    },
    "SPKINHTE": {
        id: "SPKINHTE",
        title: "Phải Trái Đúng Sai",
        author: "Michael Sandel",
        category: "kinhte", // <-- Quan trọng
        currentPrice: 120000,
        oldPrice: 150000,
        discount: 20,
        mainImage: "img/2023_05_25_15_07_28_1-390x510.webp", // Sử dụng ảnh bạn đã tải lên
        thumbnails: ["img/2023_05_25_15_07_28_1-390x510.webp"]
    }
};