// This script handles the portfolio page's dynamic content, filtering, and overlays.

document.addEventListener('DOMContentLoaded', () => {
    // ---- Mobile Menu Toggle ----
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');

    if (mobileMenu && mobileMenuBtn) {
        // Function to update button icon
        function updateButtonIcon(isOpen) {
            if (isOpen) {
                mobileMenuBtn.innerHTML = '<i class="fas fa-times"></i>';
            } else {
                mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            }
        }

        // Function to toggle menu
        function toggleMenu() {
            const isActive = mobileMenu.classList.contains('active');
            
            if (isActive) {
                mobileMenu.classList.remove('active');
                updateButtonIcon(false);
            } else {
                mobileMenu.classList.add('active');
                updateButtonIcon(true);
            }
        }

        // Add click event to hamburger button
        mobileMenuBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            toggleMenu();
        });

        // Close menu when clicking on menu links
        const mobileMenuLinks = mobileMenu.querySelectorAll('a');
        mobileMenuLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenu.classList.remove('active');
                updateButtonIcon(false);
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                if (mobileMenu.classList.contains('active')) {
                    mobileMenu.classList.remove('active');
                    updateButtonIcon(false);
                }
            }
        });
    }

    // ---- Project Data ----
    let projects = [];

    // Static project data based on actual file system structure
    const getDefaultProjects = () => {
        return [
            // Top tier - Projects with dedicated Hero images (highest quality)
            {
                id: 'modern-warehouse',
                name: 'modern-warehouse',
                images: [
                    'images/Portfolio/New\\ Construction/Modern\\ Warehouse/modern-warehouse-1-\\.jpg',
                    'images/Portfolio/New\\ Construction/Modern\\ Warehouse/modern-warehouse-3-\\.jpg',
                    'images/Portfolio/new-construction/modern-warehouse/modern-warehouse-4-\\.jpg',
                    'images/Portfolio/New\\ Construction/Modern\\ Warehouse/modern-warehouse-5-\\.jpg',
                    'images/Portfolio/new-construction/modern-warehouse/modern-warehouse (6).jpg',
                    'images/Portfolio/new-construction/modern-warehouse/modern-warehouse (7).jpg'
                ],
                hero_image: 'images/Portfolio/New\\ Construction/Modern\\ Warehouse/modern-warehouse-hero-\\.jpg',
                type: 'new-construction',
                description: 'Industrial-inspired modern home featuring open spaces and contemporary design.',
                location: 'Charlotte, NC',
                year: '2023'
            },
            {
                id: 'homeowner-haven',
                name: 'homeowner-haven',
                images: [
                    'images/Portfolio/renovation-addition/homeowner-haven/homeowner-haven-1-\\.jpg',
                    'images/Portfolio/renovation-addition/homeowner-haven/homeowner-haven (2).jpg',
                    'images/Portfolio/renovation-addition/homeowner-haven/homeowner-haven (3).jpg',
                    'images/Portfolio/renovation-addition/homeowner-haven/homeowner-haven (4).jpg',
                    'images/Portfolio/renovation-addition/homeowner-haven/homeowner-haven (5).jpg',
                    'images/Portfolio/renovation-addition/homeowner-haven/homeowner-haven-6-\\.jpg',
                    'images/Portfolio/Renovation\\+Addition/Homeowner\\ Haven/homeowner-haven-7-\\.jpg',
                    'images/Portfolio/renovation-addition/homeowner-haven/homeowner-haven-8-\\.jpg',
                    'images/Portfolio/renovation-addition/homeowner-haven/homeowner-haven (9).jpg',
                    'images/Portfolio/renovation-addition/homeowner-haven/homeowner-haven (10).jpg',
                    'images/Portfolio/renovation-addition/homeowner-haven/homeowner-haven (11).jpg',
                    'images/Portfolio/renovation-addition/homeowner-haven/homeowner-haven-12-\\.jpg',
                    'images/Portfolio/renovation-addition/homeowner-haven/homeowner-haven-13-\\.jpg',
                    'images/Portfolio/renovation-addition/homeowner-haven/homeowner-haven (14).jpg',
                    'images/Portfolio/renovation-addition/homeowner-haven/homeowner-haven (15).jpg',
                    'images/Portfolio/renovation-addition/homeowner-haven/homeowner-haven-16-\\.jpg',
                    'images/Portfolio/renovation-addition/homeowner-haven/homeowner-haven (17).jpg',
                    'images/Portfolio/renovation-addition/homeowner-haven/homeowner-haven-19-\\.jpg',
                    'images/Portfolio/renovation-addition/homeowner-haven/homeowner-haven-20-\\.jpg',
                    'images/Portfolio/renovation-addition/homeowner-haven/homeowner-haven-21-\\.jpg',
                    'images/Portfolio/Renovation\\+Addition/Homeowner\\ Haven/homeowner-haven-22-\\.jpg'
                ],
                hero_image: 'images/Portfolio/renovation-addition/homeowner-haven/homeowner-haven-hero-\\.jpg',
                type: 'renovation-addition',
                description: 'Comprehensive home renovation creating a personalized haven for modern living.',
                location: 'Charlotte, NC',
                year: '2023'
            },
            {
                id: 'riverchase',
                name: 'Riverchase',
                images: [
                    'images/Portfolio/new-construction/Riverchase/riverchase-1-\\.jpg',
                    'images/Portfolio/new-construction/Riverchase/riverchase-2-\\.jpg',
                    'images/Portfolio/New\\ Construction/Riverchase/riverchase-3-\\.jpg',
                    'images/Portfolio/New\\ Construction/Riverchase/riverchase-5-\\.jpg',
                    'images/Portfolio/new-construction/Riverchase/riverchase-6-\\.jpg',
                    'images/Portfolio/new-construction/Riverchase/riverchase-7-\\.jpg',
                    'images/Portfolio/new-construction/Riverchase/riverchase-8-\\.jpg',
                    'images/Portfolio/new-construction/Riverchase/riverchase-9-\\.jpg'
                ],
                hero_image: 'images/Portfolio/new-construction/Riverchase/riverchase-hero-\\.jpg',
                type: 'new-construction',
                description: 'Elegant residential design with river views and sophisticated architectural details.',
                location: 'Charlotte, NC',
                year: '2023'
            },
            {
                id: 'selwyn-park-cottage',
                name: 'selwyn-park-cottage',
                images: [
                    'images/Portfolio/renovation-addition/selwyn-park-cottage/selwyn-park-cottage (1).jpg',
                    'images/Portfolio/renovation-addition/selwyn-park-cottage/selwyn-park-cottage (2).jpg',
                    'images/Portfolio/renovation-addition/selwyn-park-cottage/selwyn-park-cottage (3).jpg',
                    'images/Portfolio/renovation-addition/selwyn-park-cottage/selwyn-park-cottage (4).jpg',
                    'images/Portfolio/renovation-addition/selwyn-park-cottage/selwyn-park-cottage (5).jpg',
                    'images/Portfolio/renovation-addition/selwyn-park-cottage/selwyn-park-cottage (6).jpg',
                    'images/Portfolio/renovation-addition/selwyn-park-cottage/selwyn-park-cottage (7).jpg',
                    'images/Portfolio/renovation-addition/selwyn-park-cottage/selwyn-park-cottage (8).jpg',
                    'images/Portfolio/renovation-addition/selwyn-park-cottage/selwyn-park-cottage (9).jpg',
                    'images/Portfolio/renovation-addition/selwyn-park-cottage/selwyn-park-cottage (10).jpg',
                    'images/Portfolio/renovation-addition/selwyn-park-cottage/selwyn-park-cottage (11).jpg',
                    'images/Portfolio/renovation-addition/selwyn-park-cottage/selwyn-park-cottage (12).jpg',
                    'images/Portfolio/renovation-addition/selwyn-park-cottage/selwyn-park-cottage (13).jpg'
                ],
                hero_image: 'images/Portfolio/renovation-addition/selwyn-park-cottage/selwyn-park-cottage (Hero).jpg',
                type: 'renovation-addition',
                description: 'Charming cottage renovation in Selwyn Park with period-appropriate updates.',
                location: 'Charlotte, NC',
                year: '2023'
            },
            {
                id: 'woodland',
                name: 'Woodland',
                images: [
                    'images/Portfolio/New\\ Construction/Woodland/woodland-1-\\.jpg',
                    'images/Portfolio/new-construction/Woodland/woodland-3-\\.jpg',
                    'images/Portfolio/new-construction/Woodland/woodland-4-\\.jpg',
                    'images/Portfolio/New\\ Construction/Woodland/woodland-5-\\.jpg',
                    'images/Portfolio/new-construction/Woodland/woodland-6-\\.jpg',
                    'images/Portfolio/new-construction/Woodland/woodland-7-\\.jpg',
                    'images/Portfolio/New\\ Construction/Woodland/woodland-8-\\.jpg',
                    'images/Portfolio/new-construction/Woodland/woodland-9-\\.jpg',
                    'images/Portfolio/new-construction/Woodland/woodland-10-\\.jpg',
                    'images/Portfolio/New\\ Construction/Woodland/woodland-11-\\.jpg',
                    'images/Portfolio/New\\ Construction/Woodland/woodland-12-\\.jpg',
                    'images/Portfolio/new-construction/Woodland/woodland-13-\\.jpg',
                    'images/Portfolio/new-construction/Woodland/woodland-14-\\.jpg'
                ],
                hero_image: 'images/Portfolio/new-construction/Woodland/woodland-hero-\\.jpg',
                type: 'new-construction',
                description: 'Natural woodland setting home with organic design elements and forest integration.',
                location: 'Charlotte, NC',
                year: '2023'
            },
            {
                id: 'split-level-makeover',
                name: 'split-level-makeover',
                images: [
                    'images/Portfolio/renovation-addition/split-level-makeover/splitlevelmakerover-1-\\.jpg',
                    'images/Portfolio/renovation-addition/split-level-makeover/splitlevelmakerover-2-\\.jpg',
                    'images/Portfolio/renovation-addition/split-level-makeover/splitlevelmakerover-3-\\.jpg',
                    'images/Portfolio/renovation-addition/split-level-makeover/splitlevelmakerover-4-\\.jpg',
                    'images/Portfolio/renovation-addition/split-level-makeover/splitlevelmakerover-5-\\.jpg',
                    'images/Portfolio/renovation-addition/split-level-makeover/splitlevelmakerover-6-\\.jpg',
                    'images/Portfolio/renovation-addition/split-level-makeover/splitlevelmakerover-7-\\.jpg',
                    'images/Portfolio/renovation-addition/split-level-makeover/splitlevelmakerover-8-\\.jpg',
                    'images/Portfolio/renovation-addition/split-level-makeover/splitlevelmakerover-10-\\.jpg',
                    'images/Portfolio/renovation-addition/split-level-makeover/splitlevelmakerover-11-\\.jpg',
                    'images/Portfolio/renovation-addition/split-level-makeover/splitlevelmakerover-12-\\.jpg',
                    'images/Portfolio/renovation-addition/split-level-makeover/splitlevelmakerover-13-\\.jpg',
                    'images/Portfolio/renovation-addition/split-level-makeover/splitlevelmakerover-14-\\.jpg',
                    'images/Portfolio/renovation-addition/split-level-makeover/splitlevelmakerover-15-\\.jpg',
                    'images/Portfolio/renovation-addition/split-level-makeover/splitlevelmakerover-16-\\.jpg',
                    'images/Portfolio/renovation-addition/split-level-makeover/splitlevelmakerover-17-\\.jpg',
                    'images/Portfolio/renovation-addition/split-level-makeover/splitlevelmakerover-18-\\.jpg',
                    'images/Portfolio/renovation-addition/split-level-makeover/splitlevelmakerover-19-\\.jpg',
                    'images/Portfolio/renovation-addition/split-level-makeover/splitlevelmakerover-20-\\.jpg',
                    'images/Portfolio/renovation-addition/split-level-makeover/splitlevelmakerover-21-\\.jpg',
                    'images/Portfolio/renovation-addition/split-level-makeover/splitlevelmakerover-22-\\.jpg',
                    'images/Portfolio/renovation-addition/split-level-makeover/splitlevelmakerover-23-\\.jpg',
                    'images/Portfolio/renovation-addition/split-level-makeover/splitlevelmakerover-24-\\.jpg',
                    'images/Portfolio/renovation-addition/split-level-makeover/splitlevelmakerover-25-\\.jpg',
                    'images/Portfolio/renovation-addition/split-level-makeover/splitlevelmakerover-26-\\.jpg',
                    'images/Portfolio/renovation-addition/split-level-makeover/splitlevelmakerover-27-\\.jpg',
                    'images/Portfolio/renovation-addition/split-level-makeover/splitlevelmakerover-28-\\.jpg',
                    'images/Portfolio/renovation-addition/split-level-makeover/splitlevelmakerover-29-\\.jpg',
                    'images/Portfolio/renovation-addition/split-level-makeover/splitlevelmakerover-30-\\.jpg',
                    'images/Portfolio/renovation-addition/split-level-makeover/splitlevelmakerover-31-\\.jpg',
                    'images/Portfolio/renovation-addition/split-level-makeover/splitlevelmakerover-32-\\.jpg'
                ],
                hero_image: 'images/Portfolio/renovation-addition/split-level-makeover/splitlevelmakerover-hero-\\.jpg',
                type: 'renovation-addition',
                description: 'Complete split-level home makeover with modern open concept design.',
                location: 'Charlotte, NC',
                year: '2023'
            },
            {
                id: 'ranch-renovation',
                name: 'ranch-renovation',
                images: [
                    'images/Portfolio/renovation-addition/ranch-renovation/ranch-renovation-1-\\.jpg',
                    'images/Portfolio/renovation-addition/ranch-renovation/ranch-renovation (2).JPG',
                    'images/Portfolio/renovation-addition/ranch-renovation/ranch-renovation-3-\\.jpg',
                    'images/Portfolio/renovation-addition/ranch-renovation/ranch-renovation (4).JPG',
                    'images/Portfolio/renovation-addition/ranch-renovation/ranch-renovation (5).JPG',
                    'images/Portfolio/renovation-addition/ranch-renovation/ranch-renovation-6-\\.jpg',
                    'images/Portfolio/renovation-addition/ranch-renovation/ranch-renovation-7-\\.jpg'
                ],
                hero_image: 'images/Portfolio/Renovation\\+Addition/Ranch\\ Renovation/ranch-renovation-hero-\\.jpg',
                type: 'renovation-addition',
                description: 'Ranch-style home renovation with open concept living and modern amenities.',
                location: 'Charlotte, NC',
                year: '2023'
            },
            {
                id: 'mid-century-modern-addition',
                name: 'mid-century-modern-addition + Renovation',
                images: [
                    'images/Portfolio/renovation-addition/mid-century-modern-addition/mid-century-modern-addition-renovation-1-\\.jpg',
                    'images/Portfolio/renovation-addition/mid-century-modern-addition/mid-century-modern-addition-renovation-2-\\.jpg',
                    'images/Portfolio/renovation-addition/mid-century-modern-addition/mid-century-modern-addition-renovation-3-\\.jpg',
                    'images/Portfolio/Renovation\\+Addition/Mid\\ Century\\ Modern\\ Addition/mid-century-modern-addition-renovation-4-\\.jpg',
                    'images/Portfolio/renovation-addition/mid-century-modern-addition/mid-century-modern-addition-renovation-5-\\.jpg',
                    'images/Portfolio/renovation-addition/mid-century-modern-addition/mid-century-modern-addition-renovation-6-\\.jpg',
                    'images/Portfolio/renovation-addition/mid-century-modern-addition/mid-century-modern-addition-renovation-7-\\.jpg',
                    'images/Portfolio/renovation-addition/mid-century-modern-addition/mid-century-modern-addition-renovation-8-\\.jpg',
                    'images/Portfolio/renovation-addition/mid-century-modern-addition/mid-century-modern-addition-renovaiton-9-\\.jpg',
                    'images/Portfolio/renovation-addition/mid-century-modern-addition/mid-century-modern-addition-renovation-10-\\.jpg'
                ],
                hero_image: 'images/Portfolio/renovation-addition/mid-century-modern-addition/mid-century-modern-addition  Renovation (Hero).jpg',
                type: 'renovation-addition',
                description: 'Mid-century modern addition preserving architectural character while expanding living space.',
                location: 'Charlotte, NC',
                year: '2023'
            },
            // Second tier - Projects with good hero images
            {
                id: 'williams-lake-house',
                name: 'lake-house',
                images: [
                    'images/Portfolio/New\\ Construction/lake-house/lakehouse-1-\\.jpg',
                    'images/Portfolio/New\\ Construction/Lake\\ House/lakehouse-9-\\.jpg',
                    'images/Portfolio/New\\ Construction/Lake\\ House/lakehouse-18-\\.jpg',
                    'images/Portfolio/New\\ Construction/Lake\\ House/lakehouse-19-\\.jpg',
                    'images/Portfolio/New\\ Construction/lake-house/lakehouse-20-\\.jpg',
                    'images/Portfolio/New\\ Construction/Lake\\ House/lakehouse-21-\\.jpg',
                    'images/Portfolio/New\\ Construction/lake-house/lakehouse-22-\\.jpg',
                    'images/Portfolio/New\\ Construction/lake-house/lakehouse-23-\\.jpg',
                    'images/Portfolio/New\\ Construction/lake-house/lakehouse-24-\\.jpg',
                    'images/Portfolio/New\\ Construction/lake-house/lakehouse-25-\\.jpg',
                    'images/Portfolio/New\\ Construction/lake-house/lakehouse-26-\\.jpg',
                    'images/Portfolio/New\\ Construction/lake-house/lakehouse-27-\\.jpg',
                    'images/Portfolio/New\\ Construction/Lake\\ House/lakehouse-28-\\.jpg',
                    'images/Portfolio/New\\ Construction/Lake\\ House/lakehouse-29-\\.jpg',
                    'images/Portfolio/New\\ Construction/lake-house/lakehouse-30-\\.jpg',
                    'images/Portfolio/New\\ Construction/lake-house/lakehouse-31-\\.jpg',
                    'images/Portfolio/New\\ Construction/Lake\\ House/lakehouse-32-\\.jpg',
                    'images/Portfolio/New\\ Construction/Lake\\ House/lakehouse-33-\\.jpg',
                    'images/Portfolio/New\\ Construction/lake-house/lakehouse-34-\\.jpg',
                    'images/Portfolio/New\\ Construction/lake-house/lakehouse-35-\\.jpg',
                    'images/Portfolio/New\\ Construction/Lake\\ House/lakehouse-36-\\.jpg',
                    'images/Portfolio/New\\ Construction/Lake\\ House/lakehouse-37-\\.jpg',
                    'images/Portfolio/New\\ Construction/Lake\\ House/lakehouse-38-\\.jpg',
                    'images/Portfolio/New\\ Construction/lake-house/lakehouse-39-\\.jpg',
                    'images/Portfolio/New\\ Construction/lake-house/lakehouse-40-\\.jpg',
                    'images/Portfolio/New\\ Construction/lake-house/lakehouse-41-\\.jpg',
                    'images/Portfolio/New\\ Construction/lake-house/lakehouse-42-\\.jpg',
                    'images/Portfolio/New\\ Construction/Lake\\ House/lakehouse-43-\\.jpg',
                    'images/Portfolio/New\\ Construction/lake-house/lakehouse-44-\\.jpg',
                    'images/Portfolio/New\\ Construction/lake-house/lakehouse-45-\\.jpg',
                    'images/Portfolio/New\\ Construction/lake-house/lakehouse-46-\\.jpg',
                    'images/Portfolio/New\\ Construction/Lake\\ House/lakehouse-47-\\.jpg',
                    'images/Portfolio/New\\ Construction/lake-house/lakehouse-48-\\.jpg',
                    'images/Portfolio/New\\ Construction/lake-house/lakehouse-49-\\.jpg',
                    'images/Portfolio/New\\ Construction/lake-house/lakehouse-50-\\.jpg',
                    'images/Portfolio/New\\ Construction/lake-house/lakehouse-51-\\.jpg',
                    'images/Portfolio/New\\ Construction/Lake\\ House/lakehouse-52-\\.jpg',
                    'images/Portfolio/New\\ Construction/Lake\\ House/lakehouse-53-\\.jpg'
                ],
                hero_image: 'images/Portfolio/New\\ Construction/lake-house/lakehouse-hero-\\.jpg',
                type: 'new-construction',
                description: 'Lakeside residence designed to maximize water views and outdoor living.',
                location: 'Charlotte, NC',
                year: '2023'
            },
            {
                id: 'contemporary-french',
                name: 'contemporary-french',
                images: [
                    'images/Portfolio/New\\ Construction/Contemporary\\ French/contemporaryfrench-1-\\.png',
                    'images/Portfolio/New\\ Construction/Contemporary\\ French/contemporaryfrench-3-\\.png',
                    'images/Portfolio/new-construction/contemporary-french/contemporaryfrench-4-\\.png',
                    'images/Portfolio/new-construction/contemporary-french/contemporaryfrench-5-\\.png',
                    'images/Portfolio/new-construction/contemporary-french/contemporaryfrench-6-\\.png',
                    'images/Portfolio/New\\ Construction/Contemporary\\ French/contemporaryfrench-7-\\.png',
                    'images/Portfolio/new-construction/contemporary-french/contemporaryfrench-8-\\.png',
                    'images/Portfolio/new-construction/contemporary-french/contemporaryfrench-9-\\.png',
                    'images/Portfolio/New\\ Construction/Contemporary\\ French/contemporaryfrench-10-\\.png',
                    'images/Portfolio/new-construction/contemporary-french/contemporaryfrench-11-\\.png',
                    'images/Portfolio/new-construction/contemporary-french/contemporaryfrench-12-\\.png',
                    'images/Portfolio/new-construction/contemporary-french/contemporaryfrench-13-\\.png',
                    'images/Portfolio/New\\ Construction/Contemporary\\ French/contemporaryfrench-14-\\.png',
                    'images/Portfolio/new-construction/contemporary-french/contemporaryfrench-15-\\.png',
                    'images/Portfolio/new-construction/contemporary-french/contemporaryfrench-16-\\.png',
                    'images/Portfolio/new-construction/contemporary-french/contemporaryfrench-17-\\.png',
                    'images/Portfolio/New\\ Construction/Contemporary\\ French/contemporaryfrench-18-\\.png',
                    'images/Portfolio/new-construction/contemporary-french/contemporaryfrench-19-\\.png',
                    'images/Portfolio/new-construction/contemporary-french/contemporaryfrench-20-\\.png',
                    'images/Portfolio/New\\ Construction/Contemporary\\ French/contemporaryfrench-21-\\.png',
                    'images/Portfolio/new-construction/contemporary-french/contemporaryfrench-22-\\.png',
                    'images/Portfolio/new-construction/contemporary-french/contemporaryfrench-23-\\.png',
                    'images/Portfolio/new-construction/contemporary-french/contemporaryfrench-24-\\.png',
                    'images/Portfolio/new-construction/contemporary-french/contemporaryfrench-25-\\.png',
                    'images/Portfolio/new-construction/contemporary-french/contemporaryfrench-26-\\.png',
                    'images/Portfolio/New\\ Construction/Contemporary\\ French/contemporaryfrench-27-\\.png',
                    'images/Portfolio/new-construction/contemporary-french/contemporaryfrench-28-\\.png',
                    'images/Portfolio/new-construction/contemporary-french/contemporaryfrench-29-\\.png',
                    'images/Portfolio/new-construction/contemporary-french/contemporaryfrench-30-\\.png',
                    'images/Portfolio/New\\ Construction/Contemporary\\ French/contemporaryfrench-31-\\.png',
                    'images/Portfolio/new-construction/contemporary-french/contemporaryfrench-32-\\.png',
                    'images/Portfolio/new-construction/contemporary-french/contemporaryfrench-33-\\.png',
                    'images/Portfolio/New\\ Construction/Contemporary\\ French/contemporaryfrench-34-\\.png',
                    'images/Portfolio/new-construction/contemporary-french/contemporaryfrench-35-\\.png'
                ],
                hero_image: 'images/Portfolio/new-construction/contemporary-french/contemporaryfrench-hero-\\.png',
                type: 'new-construction',
                description: 'Modern French-inspired residential design with clean lines and elegant proportions.',
                location: 'Charlotte, NC',
                year: '2023'
            },
            {
                id: 'french-country',
                name: 'french-country',
                images: [
                    'images/Portfolio/new-construction/french-country/french-country (2).jpg',
                    'images/Portfolio/new-construction/french-country/french-country (3).jpg',
                    'images/Portfolio/new-construction/french-country/french-country (4).jpg',
                    'images/Portfolio/new-construction/french-country/french-country (5).jpg',
                    'images/Portfolio/new-construction/french-country/french-country (6).jpg',
                    'images/Portfolio/new-construction/french-country/french-country (7).jpg',
                    'images/Portfolio/new-construction/french-country/french-country (8).jpg',
                    'images/Portfolio/new-construction/french-country/french-country (9).jpg',
                    'images/Portfolio/new-construction/french-country/french-country (10).jpg',
                    'images/Portfolio/new-construction/french-country/french-country (11).jpg',
                    'images/Portfolio/new-construction/french-country/french-country (12).jpg'
                ],
                hero_image: 'images/Portfolio/new-construction/french-country/french-country (Hero).jpg',
                type: 'new-construction',
                description: 'Charming french-country home featuring rustic elegance and traditional craftsmanship.',
                location: 'Charlotte, NC',
                year: '2023'
            },
            {
                id: 'low-country-cabin',
                name: 'low-country-cabin',
                images: [
                    'images/Portfolio/new-construction/low-country-cabin/lowcountrycabin-1-\\.jpg',
                    'images/Portfolio/new-construction/low-country-cabin/lowcountrycabin-2-\\.jpg',
                    'images/Portfolio/new-construction/low-country-cabin/lowcountrycabin-4-\\.jpg',
                    'images/Portfolio/new-construction/low-country-cabin/lowcountrycabin-5-\\.jpg'
                ],
                hero_image: 'images/Portfolio/New\\ Construction/Low\\ Country\\ Cabin/lowcountrycabin-hero-\\.jpg',
                type: 'new-construction',
                description: 'Cozy low-country-cabin design with natural materials and coastal influences.',
                location: 'Charlotte, NC',
                year: '2023'
            },
            {
                id: 'melchor-residence',
                name: 'melchor-residence',
                images: [
                    'images/Portfolio/new-construction/melchor-residence/melchor-residence-1-\\.jpg',
                    'images/Portfolio/new-construction/melchor-residence/melchor-residence-2-\\.jpg',
                    'images/Portfolio/new-construction/melchor-residence/melchor-residence-3-\\.jpg',
                    'images/Portfolio/new-construction/melchor-residence/melchor-residence-4-\\.jpg',
                    'images/Portfolio/New\\ Construction/Melchor\\ Residence/melchor-residence-5-\\.jpg',
                    'images/Portfolio/new-construction/melchor-residence/melchor-residence (6).jpg',
                    'images/Portfolio/new-construction/melchor-residence/melchor-residence-7-\\.jpg',
                    'images/Portfolio/new-construction/melchor-residence/melchor-residence-8-\\.jpg',
                    'images/Portfolio/new-construction/melchor-residence/melchor-residence-9-\\.jpg'
                ],
                hero_image: 'images/Portfolio/new-construction/melchor-residence/melchor-residence-hero-\\.jpg',
                type: 'new-construction',
                description: 'Custom residential design blending modern amenities with timeless architectural elements.',
                location: 'Charlotte, NC',
                year: '2023'
            },
            {
                id: 'sabik',
                name: 'Sabik',
                images: [
                    'images/Portfolio/new-construction/Sabik/sabik-1-\\.jpg',
                    'images/Portfolio/New\\ Construction/Sabik/sabik-3-\\.jpg',
                    'images/Portfolio/new-construction/Sabik/sabik-4-\\.jpg',
                    'images/Portfolio/new-construction/Sabik/sabik-5-\\.jpg',
                    'images/Portfolio/New\\ Construction/Sabik/sabik-6-\\.jpg',
                    'images/Portfolio/new-construction/Sabik/sabik-7-\\.jpg',
                    'images/Portfolio/New\\ Construction/Sabik/sabik-10-\\.jpg',
                    'images/Portfolio/New\\ Construction/Sabik/sabik-11-\\.jpg',
                    'images/Portfolio/new-construction/Sabik/sabik-12-\\.jpg',
                    'images/Portfolio/new-construction/Sabik/sabik-13-\\.jpg',
                    'images/Portfolio/new-construction/Sabik/sabik-14-\\.jpg',
                    'images/Portfolio/New\\ Construction/Sabik/sabik-15-\\.jpg',
                    'images/Portfolio/new-construction/Sabik/sabik-16-\\.jpg',
                    'images/Portfolio/new-construction/Sabik/sabik-17-\\.jpg',
                    'images/Portfolio/new-construction/Sabik/sabik-18-\\.jpg'
                ],
                hero_image: 'images/Portfolio/New\\ Construction/Sabik/sabik-hero-\\.jpg',
                type: 'new-construction',
                description: 'Contemporary home design featuring clean lines and modern living spaces.',
                location: 'Charlotte, NC',
                year: '2023'
            },
            {
                id: 'shingle-style',
                name: 'shingle-style',
                images: [
                    'images/Portfolio/new-construction/shingle-style/shingle-style (Hero).jpg'
                ],
                hero_image: 'images/Portfolio/new-construction/shingle-style/shingle-style (Hero).jpg',
                type: 'new-construction',
                description: 'Classic shingle-style architecture with traditional New England influences.',
                location: 'Charlotte, NC',
                year: '2023'
            },
            // Third tier - Remaining projects mixed together
            {
                id: 'dilworth-renovation',
                name: 'dilworth-renovation',
                images: [
                    'images/Portfolio/renovation-addition/dilworth-renovation/MtVernon _03.jpg',
                    'images/Portfolio/renovation-addition/dilworth-renovation/MtVernon _04.jpg',
                    'images/Portfolio/renovation-addition/dilworth-renovation/MtVernon _05.jpg',
                    'images/Portfolio/renovation-addition/dilworth-renovation/MtVernon _06.jpg',
                    'images/Portfolio/renovation-addition/dilworth-renovation/MtVernon _07.jpg',
                    'images/Portfolio/renovation-addition/dilworth-renovation/MtVernon _08.jpg',
                    'images/Portfolio/renovation-addition/dilworth-renovation/MtVernon _09.jpg',
                    'images/Portfolio/renovation-addition/dilworth-renovation/MtVernon _10.jpg',
                    'images/Portfolio/renovation-addition/dilworth-renovation/MtVernon _11.jpg',
                    'images/Portfolio/renovation-addition/dilworth-renovation/MtVernon _12.jpg',
                    'images/Portfolio/renovation-addition/dilworth-renovation/MtVernon _13.jpg',
                    'images/Portfolio/renovation-addition/dilworth-renovation/MtVernon _14.jpg',
                    'images/Portfolio/renovation-addition/dilworth-renovation/MtVernon _15.jpg',
                    'images/Portfolio/renovation-addition/dilworth-renovation/MtVernon _16.jpg',
                    'images/Portfolio/renovation-addition/dilworth-renovation/MtVernon _17.jpg',
                    'images/Portfolio/renovation-addition/dilworth-renovation/MtVernon _18.jpg'
                ],
                hero_image: 'images/Portfolio/renovation-addition/dilworth-renovation/MtVernon _03.jpg',
                type: 'renovation-addition',
                description: 'Comprehensive dilworth-renovation preserving neighborhood character while modernizing functionality.',
                location: 'Charlotte, NC',
                year: '2023'
            },
            {
                id: 'heavy-timber-pool-house',
                name: 'heavy-timber-pool-house',
                images: [
                    'images/Portfolio/renovation-addition/heavy-timber-pool-house/heavy-timber_01\\.jpg',
                    'images/Portfolio/renovation-addition/heavy-timber-pool-house/IMG_0503.JPG',
                    'images/Portfolio/renovation-addition/heavy-timber-pool-house/IMG_0506.JPG',
                    'images/Portfolio/renovation-addition/heavy-timber-pool-house/IMG_0523.jpg',
                    'images/Portfolio/renovation-addition/heavy-timber-pool-house/IMG_0526.jpg',
                    'images/Portfolio/renovation-addition/heavy-timber-pool-house/IMG_0527.jpg',
                    'images/Portfolio/renovation-addition/heavy-timber-pool-house/IMG_0528.jpg',
                    'images/Portfolio/renovation-addition/heavy-timber-pool-house/IMG_0529.JPG',
                    'images/Portfolio/renovation-addition/heavy-timber-pool-house/IMG_0531.jpg',
                    'images/Portfolio/renovation-addition/heavy-timber-pool-house/IMG-0500.jpg'
                ],
                hero_image: 'images/Portfolio/renovation-addition/heavy-timber-pool-house/heavy-timber_01\\.jpg',
                type: 'renovation-addition',
                description: 'Custom heavy-timber-pool-house addition with rustic elegance and modern amenities.',
                location: 'Charlotte, NC',
                year: '2023'
            },
            {
                id: 'lake-house-renovation',
                name: 'lake-house-renovation',
                images: [
                    'images/Portfolio/renovation-addition/lake-house-renovation/DSC_3069.JPG',
                    'images/Portfolio/renovation-addition/lake-house-renovation/DSC_3088.JPG',
                    'images/Portfolio/renovation-addition/lake-house-renovation/DSC_3090.JPG',
                    'images/Portfolio/renovation-addition/lake-house-renovation/DSC_3100.JPG',
                    'images/Portfolio/renovation-addition/lake-house-renovation/DSC_3110.JPG',
                    'images/Portfolio/renovation-addition/lake-house-renovation/DSC_3112.JPG',
                    'images/Portfolio/renovation-addition/lake-house-renovation/DSC_3131.JPG',
                    'images/Portfolio/renovation-addition/lake-house-renovation/DSC_3185.JPG',
                    'images/Portfolio/renovation-addition/lake-house-renovation/DSC_3263.jpg'
                ],
                hero_image: 'images/Portfolio/renovation-addition/lake-house-renovation/DSC_3069.JPG',
                type: 'renovation-addition',
                description: 'Lakeside home renovation maximizing water views and outdoor living opportunities.',
                location: 'Charlotte, NC',
                year: '2023'
            },
            {
                id: 'screened-porch-addition',
                name: 'Screened Porch Addition',
                images: [
                    'images/Portfolio/renovation-addition/screened-porch-additon/DSC_0044.JPG',
                    'images/Portfolio/renovation-addition/screened-porch-additon/DSC_0045.JPG',
                    'images/Portfolio/renovation-addition/screened-porch-additon/DSC_0046.JPG',
                    'images/Portfolio/renovation-addition/screened-porch-additon/DSC_0047.JPG',
                    'images/Portfolio/renovation-addition/screened-porch-additon/DSC_0048.JPG',
                    'images/Portfolio/renovation-addition/screened-porch-additon/DSC_0049.JPG',
                    'images/Portfolio/renovation-addition/screened-porch-additon/DSC_0050.JPG',
                    'images/Portfolio/renovation-addition/screened-porch-additon/DSC_0051.JPG',
                    'images/Portfolio/renovation-addition/screened-porch-additon/DSC_0052.JPG',
                    'images/Portfolio/renovation-addition/screened-porch-additon/DSC_0053.JPG',
                    'images/Portfolio/renovation-addition/screened-porch-additon/DSC_0054.JPG',
                    'images/Portfolio/renovation-addition/screened-porch-additon/DSC_0055.JPG',
                    'images/Portfolio/renovation-addition/screened-porch-additon/DSC_0056.JPG',
                    'images/Portfolio/renovation-addition/screened-porch-additon/DSC_0057.JPG',
                    'images/Portfolio/renovation-addition/screened-porch-additon/DSC_0058.JPG',
                    'images/Portfolio/renovation-addition/screened-porch-additon/DSC_0059.JPG',
                    'images/Portfolio/renovation-addition/screened-porch-additon/DSC_0060.JPG',
                    'images/Portfolio/renovation-addition/screened-porch-additon/DSC_0061.JPG',
                    'images/Portfolio/renovation-addition/screened-porch-additon/DSC_0062.JPG',
                    'images/Portfolio/renovation-addition/screened-porch-additon/DSC_0063.JPG',
                    'images/Portfolio/renovation-addition/screened-porch-additon/DSC_0064.JPG',
                    'images/Portfolio/renovation-addition/screened-porch-additon/DSC_0065.JPG',
                    'images/Portfolio/renovation-addition/screened-porch-additon/DSC_0066.JPG',
                    'images/Portfolio/renovation-addition/screened-porch-additon/DSC_0067.JPG',
                    'images/Portfolio/renovation-addition/screened-porch-additon/DSC_0068.JPG',
                    'images/Portfolio/renovation-addition/screened-porch-additon/DSC_0069.JPG',
                    'images/Portfolio/renovation-addition/screened-porch-additon/DSC_0070.JPG',
                    'images/Portfolio/renovation-addition/screened-porch-additon/DSC_0071.JPG',
                    'images/Portfolio/renovation-addition/screened-porch-additon/DSC_0072.JPG',
                    'images/Portfolio/renovation-addition/screened-porch-additon/DSC_0073.JPG',
                    'images/Portfolio/renovation-addition/screened-porch-additon/DSC_0074.JPG',
                    'images/Portfolio/renovation-addition/screened-porch-additon/DSC_0075.JPG',
                    'images/Portfolio/renovation-addition/screened-porch-additon/DSC_0076.JPG',
                    'images/Portfolio/renovation-addition/screened-porch-additon/DSC_0077.JPG',
                    'images/Portfolio/renovation-addition/screened-porch-additon/DSC_0078.JPG'
                ],
                hero_image: 'images/Portfolio/renovation-addition/screened-porch-additon/DSC_0044.JPG',
                type: 'renovation-addition',
                description: 'Screened porch addition creating year-round outdoor living space.',
                location: 'Charlotte, NC',
                year: '2023'
            },
            {
                id: 'wine-pavilion',
                name: 'Wine Pavilion',
                images: [
                    'images/Portfolio/renovation-addition/wine-pavlion/DSC_1425.JPG',
                    'images/Portfolio/renovation-addition/wine-pavlion/DSC_1477.JPG',
                    'images/Portfolio/renovation-addition/wine-pavlion/DSC_1485.JPG',
                    'images/Portfolio/renovation-addition/wine-pavlion/WP2.jpg',
                    'images/Portfolio/renovation-addition/wine-pavlion/WP5.jpg',
                    'images/Portfolio/renovation-addition/wine-pavlion/WP6.jpg'
                ],
                hero_image: 'images/Portfolio/renovation-addition/wine-pavlion/WP6.jpg',
                type: 'renovation-addition',
                description: 'Custom wine pavilion addition for entertaining and wine storage.',
                location: 'Charlotte, NC',
                year: '2023'
            },
            {
                id: 'myers-park-renovation',
                name: 'myers-park-renovation',
                images: [
                    'images/Portfolio/renovation-addition/myers-park-renovation/Front_After.jpg',
                    'images/Portfolio/renovation-addition/myers-park-renovation/kitchen_after-copy\\.jpg',
                    'images/Portfolio/renovation-addition/myers-park-renovation/rear_after-copy\\.jpg'
                ],
                hero_image: 'images/Portfolio/renovation-addition/myers-park-renovation/Front_After.jpg',
                type: 'renovation-addition',
                description: 'myers-park-renovation maintaining neighborhood character with modern updates.',
                location: 'Charlotte, NC',
                year: '2023'
            },
            {
                id: 'early-classical-facade-renovation',
                name: 'early-classical-facade-renovation',
                images: [
                    'images/Portfolio/renovation-addition/early-classical-facade-renovation/dsc_1370-rev\\.jpg',
                    'images/Portfolio/renovation-addition/early-classical-facade-renovation/DSC_2724.JPG',
                    'images/Portfolio/renovation-addition/early-classical-facade-renovation/DSC_2725.jpg'
                ],
                hero_image: 'images/Portfolio/renovation-addition/early-classical-facade-renovation/dsc_1370-rev\\.jpg',
                type: 'renovation-addition',
                description: 'Early Classical facade restoration maintaining historical architectural integrity.',
                location: 'Charlotte, NC',
                year: '2023'
            },
            {
                id: 'laurel-conversion',
                name: 'laurel-conversion',
                images: [
                    'images/Portfolio/renovation-addition/laurel-conversion/DSC_3127.jpg'
                ],
                hero_image: 'images/Portfolio/renovation-addition/laurel-conversion/DSC_3127.jpg',
                type: 'renovation-addition',
                description: 'Creative space conversion in Laurel neighborhood with modern functionality.',
                location: 'Charlotte, NC',
                year: '2023'
            },
            {
                id: 'montibello-backyard-getaway',
                name: 'montibello-backyard-getaway',
                images: [
                    'images/Portfolio/renovation-addition/montibello-backyard-getaway/DSC_1371.jpg'
                ],
                hero_image: 'images/Portfolio/renovation-addition/montibello-backyard-getaway/DSC_1371.jpg',
                type: 'renovation-addition',
                description: 'Backyard retreat addition creating a private outdoor sanctuary.',
                location: 'Charlotte, NC',
                year: '2023'
            },
            {
                id: 'pelham-woods-renovation',
                name: 'pelham-woods-renovation',
                images: [
                    'images/Portfolio/renovation-addition/pelham-woods-renovation/pelham-woods-renovation (Hero).jpg'
                ],
                hero_image: 'images/Portfolio/renovation-addition/pelham-woods-renovation/pelham-woods-renovation (Hero).jpg',
                type: 'renovation-addition',
                description: 'pelham-woods-renovation with natural setting integration.',
                location: 'Charlotte, NC',
                year: '2023'
            },
            {
                id: 'colonial-revival',
                name: 'colonial-revival',
                images: [
                    'images/Portfolio/renovation-addition/colonial-revival/FrontFacade.jpg'
                ],
                hero_image: 'images/Portfolio/renovation-addition/colonial-revival/FrontFacade.jpg',
                type: 'renovation-addition',
                description: 'Classic colonial-revival renovation preserving historical character while adding modern amenities.',
                location: 'Charlotte, NC',
                year: '2023'
            },
            {
                id: 'cotswold-outdoor-entertainment',
                name: 'cotswold-outdoor-entertainment',
                images: [
                    'images/Portfolio/renovation-addition/cotswold-outdoor-entertainment/4116-faulkner-1\\.jpg'
                ],
                hero_image: 'images/Portfolio/renovation-addition/cotswold-outdoor-entertainment/4116-faulkner-1\\.jpg',
                type: 'renovation-addition',
                description: 'Outdoor entertainment space addition with Cotswold architectural influences.',
                location: 'Charlotte, NC',
                year: '2023'
            },
            {
                id: 'federal-makeover',
                name: 'federal-makeover',
                images: [
                    'images/Portfolio/renovation-addition/federal-makeover/DSC_0006.jpg'
                ],
                hero_image: 'images/Portfolio/renovation-addition/federal-makeover/DSC_0006.jpg',
                type: 'renovation-addition',
                description: 'Federal style home renovation with period-appropriate updates and modern conveniences.',
                location: 'Charlotte, NC',
                year: '2023'
            }
        ];
    };

    // Load projects from file system structure
    const loadProjectsFromFileSystem = () => {
        projects = getDefaultProjects();
        console.log('âœ… Loaded projects from file system:', projects.length);
    };

    // Initialize projects
    loadProjectsFromFileSystem();
    console.log('Projects loaded:', projects);

    // ---- Filtering Logic ----
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectGrid = document.querySelector('#projectGrid');

    // Filter projects by type
    const filterProjects = (type) => {
        const filteredProjects = type === 'all' ? projects : projects.filter(project => project.type === type);
        displayProjects(filteredProjects);
        
        // Update active filter button
        filterButtons.forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-filter="${type}"]`).classList.add('active');
    };

    // Display projects in grid
    const displayProjects = (projectsToShow) => {
        console.log('Displaying projects:', projectsToShow.length);
        if (!projectGrid) {
            console.error('Project grid not found!');
            return;
        }
        
        projectGrid.innerHTML = '';

        projectsToShow.forEach(project => {
            const projectCard = createProjectCard(project);
            projectGrid.appendChild(projectCard);
        });
        
        console.log('Projects displayed in grid');
    };

    // Create project card element
    const createProjectCard = (project) => {
        const card = document.createElement('div');
        card.className = 'project-card';
        card.setAttribute('data-project-id', project.id);
        
        card.innerHTML = `
            <div class="project-image">
                <img data-lazy-src="${project.hero_image}" alt="${project.name}" class="lazy-loading" />
            </div>
            <div class="project-info">
                <h3>${project.name}</h3>
                <p class="project-type">${project.type}</p>
            </div>
        `;
        
        // Set up lazy loading for the image
        const img = card.querySelector('img');
        if (window.lazyLoader && img) {
            window.lazyLoader.observe(img, project.hero_image, {
                width: 400,
                height: 300,
                onLoad: (loadedImg) => {
                    // Add smooth transition when image loads
                    loadedImg.style.transition = 'opacity 0.3s ease-in-out';
                    loadedImg.style.opacity = '0';
                    loadedImg.offsetHeight; // Trigger reflow
                    loadedImg.style.opacity = '1';
                },
                onError: (errorImg, src) => {
                    console.warn('Failed to load project image:', src);
                    // Keep the placeholder visible
                }
            });
        }
        
        // Click event will be handled by gallery modal integration
        
        return card;
    };


    // ---- Filter Button Event Listeners ----
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filterType = button.getAttribute('data-filter');
            filterProjects(filterType);
        });
    });

    // Initialize with all projects
    filterProjects('all');

    // ---- Gallery Modal Integration ----
    // Ensure the gallery modal is properly initialized for portfolio project cards
    if (window.galleryModal) {
        logger.info('Gallery modal found, setting up portfolio integration');
        
        // Get project data and set it in the modal
        const projectsData = getDefaultProjects();
        if (projectsData) {
            // Convert the array of projects to an object keyed by their IDs
            const projectsObject = projectsData.reduce((obj, project) => {
                obj[project.id] = project;
                return obj;
            }, {});
            window.galleryModal.setProjectsData(projectsObject);
            logger.success('Project data set in gallery modal for portfolio');
        } else {
            logger.warn('No project data found. Gallery modal cannot be initialized.');
        }
        
        // Add event listeners to project cards to open the modal
        const portfolioProjectCards = document.querySelectorAll('.project-card[data-project-id]');
        portfolioProjectCards.forEach(card => {
            // Remove any existing event listeners to avoid duplicates
            card.removeEventListener('click', handlePortfolioProjectCardClick);
            
            // Add new event listener
            card.addEventListener('click', handlePortfolioProjectCardClick);
        });
        
        logger.info(`Added click listeners to ${portfolioProjectCards.length} portfolio project cards`);
    } else {
        logger.error('Gallery modal not available - project cards will not work');
    }
    
    // Portfolio project card click handler function
    function handlePortfolioProjectCardClick(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const projectId = this.getAttribute('data-project-id');
        logger.info('Portfolio project card clicked', { projectId, modalReady: window.galleryModal?.isReady() });
        
        if (projectId && window.galleryModal) {
            try {
                window.galleryModal.openProject(projectId);
            } catch (error) {
                logger.error('Failed to open project from portfolio card', error, { projectId });
            }
        } else {
            logger.warn('Cannot open project - missing projectId or gallery modal', { 
                hasProjectId: !!projectId, 
                hasGalleryModal: !!window.galleryModal 
            });
        }
    }
});




