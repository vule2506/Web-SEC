// Đây là tệp giả lập cơ sở dữ liệu của bạn.
// Trong một ứng dụng thật, dữ liệu này sẽ được lấy từ máy chủ (backend).

const productDatabase = {
    // "SPALCH" là ID sản phẩm, khớp với data-id trong nút "Thêm vào giỏ"
    "SPALCH": {
        id: "SPALCH",
        title: "Alchemised - Paperback",
        supplier: "Penguin Books",
        author: "SenLinYu",
        publisher: "Del Rey",
        binding: "Bìa Mềm",
        reviewCount: 0,
        soldCount: 37,
        currentPrice: 626000,
        oldPrice: 696000,
        discount: 10,
        mainImage: "https://placehold.co/400x600/B2EBF2/000000?text=Bìa+Sách",
        thumbnails: [
            "https://placehold.co/80x120/B2EBF2/000000?text=Bìa+1",
            "https://placehold.co/80x120/FFCDD2/000000?text=Bìa+2"
        ],
        sku: "9798217091256",
        releaseDate: "25/10/2025",
        year: 2025,
        pages: 1040,
        // Tách mô tả bằng ký tự \n\n để tạo đoạn mới
        description: "In this riveting dark fantasy debut, a woman with missing memories fights to survive a war-torn world of necromancy and alchemy—and the man tasked with unearthing the deepest secrets of her past...\n\nSeventeen-year-old Alchemised has no memory of her life before waking up in a forest, her body marked with strange alchemical symbols. She soon discovers she possesses powerful abilities—she can manipulate matter and even raise the dead. But Alchemised is also hunted by ruthless mercenaries who seek to exploit her powers for their own gain.\n\nEnter Kael, a skilled alchemist and mercenary hired to capture Alchemised. As he tracks her across a war-torn land, Kael finds himself drawn"
    },
    // Thêm một sản phẩm khác để ví dụ
    "SPHARRY": {
        id: "SPHARRY",
        title: "Harry Potter and the Sorcerer's Stone",
        supplier: "Bloomsbury",
        author: "J.K. Rowling",
        publisher: "Scholastic",
        binding: "Bìa Cứng",
        reviewCount: 1520,
        soldCount: 8900,
        currentPrice: 350000,
        oldPrice: 400000,
        discount: 13,
        mainImage: "https://placehold.co/400x600/E57373/FFFFFF?text=Harry+Potter",
        thumbnails: [
            "https://placehold.co/80x120/E57373/FFFFFF?text=Harry+1",
            "https://placehold.co/80x120/FFEB3B/000000?text=Harry+2"
        ],
        sku: "9780747532743",
        releaseDate: "26/06/1997",
        year: 1997,
        pages: 309,
        description: "Harry Potter has no idea how famous he is. That's because he's being raised by his miserable aunt and uncle who are terrified Harry will learn that he's really a wizard, just as his parents were. But everything changes when Harry is summoned to attend an infamous school for wizards, and he begins to discover some clues about his mysterious past."
    }
    // ... Thêm các cuốn sách khác của bạn vào đây
};