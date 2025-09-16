// Portfolio Page Script - Simplified for Modal Gallery System
// This script handles the portfolio page's dynamic content, filtering, and basic functionality.

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
            {
                id: 'modern-warehouse',
                name: 'modern-warehouse',
                images: [
                    'images/Portfolio/New Construction/modern-warehouse/modern-warehouse-1-.jpg',
                    'images/Portfolio/New Construction/modern-warehouse/modern-warehouse-3-.jpg',
                    'images/Portfolio/New Construction/modern-warehouse/modern-warehouse-4-.jpg',
                    'images/Portfolio/New Construction/modern-warehouse/modern-warehouse-5-.jpg',
                    'images/Portfolio/New Construction/modern-warehouse/modern-warehouse (6).jpg',
                    'images/Portfolio/New Construction/modern-warehouse/modern-warehouse (7).jpg'
                ],
                type: 'new-construction'
            },
            {
                id: 'homeowner-haven',
                name: 'homeowner-haven',
                images: [
                    'images/Portfolio/Renovation+Addition/homeowner-haven/homeowner-haven-1-.jpg',
                    'images/Portfolio/Renovation+Addition/homeowner-haven/homeowner-haven (2).jpg',
                    'images/Portfolio/Renovation+Addition/homeowner-haven/homeowner-haven (3).jpg',
                    'images/Portfolio/Renovation+Addition/homeowner-haven/homeowner-haven (4).jpg',
                    'images/Portfolio/Renovation+Addition/homeowner-haven/homeowner-haven (5).jpg',
                    'images/Portfolio/Renovation+Addition/homeowner-haven/homeowner-haven-6-.jpg',
                    'images/Portfolio/Renovation+Addition/homeowner-haven/homeowner-haven-7-.jpg',
                    'images/Portfolio/Renovation+Addition/homeowner-haven/homeowner-haven-8-.jpg',
                    'images/Portfolio/Renovation+Addition/homeowner-haven/homeowner-haven (9).jpg',
                    'images/Portfolio/Renovation+Addition/homeowner-haven/homeowner-haven (10).jpg',
                    'images/Portfolio/Renovation+Addition/homeowner-haven/homeowner-haven (11).jpg',
                    'images/Portfolio/Renovation+Addition/homeowner-haven/homeowner-haven-12-.jpg',
                    'images/Portfolio/Renovation+Addition/homeowner-haven/homeowner-haven-13-.jpg',
                    'images/Portfolio/Renovation+Addition/homeowner-haven/homeowner-haven (14).jpg',
                    'images/Portfolio/Renovation+Addition/homeowner-haven/homeowner-haven (15).jpg',
                    'images/Portfolio/Renovation+Addition/homeowner-haven/homeowner-haven-16-.jpg',
                    'images/Portfolio/Renovation+Addition/homeowner-haven/homeowner-haven (17).jpg',
                    'images/Portfolio/Renovation+Addition/homeowner-haven/homeowner-haven-19-.jpg',
                    'images/Portfolio/Renovation+Addition/homeowner-haven/homeowner-haven-20-.jpg',
                    'images/Portfolio/Renovation+Addition/homeowner-haven/homeowner-haven-21-.jpg',
                    'images/Portfolio/Renovation+Addition/homeowner-haven/homeowner-haven-22-.jpg'
                ],
                hero_image: 'images/Portfolio/Renovation+Addition/homeowner-haven/homeowner-haven-hero-.jpg',
                type: 'renovation-addition'
            },
            {
                id: 'riverchase',
                name: 'Riverchase',
                images: [
                    'images/Portfolio/New Construction/Riverchase/riverchase-1-.jpg',
                    'images/Portfolio/New Construction/Riverchase/riverchase-2-.jpg',
                    'images/Portfolio/New Construction/Riverchase/riverchase-3-.jpg',
                    'images/Portfolio/New Construction/Riverchase/riverchase-5-.jpg',
                    'images/Portfolio/New Construction/Riverchase/riverchase-6-.jpg',
                    'images/Portfolio/New Construction/Riverchase/riverchase-7-.jpg',
                    'images/Portfolio/New Construction/Riverchase/riverchase-8-.jpg',
                    'images/Portfolio/New Construction/Riverchase/riverchase-9-.jpg'
                ],
                type: 'new-construction'
            },
            {
                id: 'selwyn-park-cottage',
                name: 'selwyn-park-cottage',
                images: [
                    'images/Portfolio/Renovation+Addition/selwyn-park-cottage/selwyn-park-cottage (1).jpg',
                    'images/Portfolio/Renovation+Addition/selwyn-park-cottage/selwyn-park-cottage (2).jpg',
                    'images/Portfolio/Renovation+Addition/selwyn-park-cottage/selwyn-park-cottage (3).jpg',
                    'images/Portfolio/Renovation+Addition/selwyn-park-cottage/selwyn-park-cottage (4).jpg',
                    'images/Portfolio/Renovation+Addition/selwyn-park-cottage/selwyn-park-cottage (5).jpg',
                    'images/Portfolio/Renovation+Addition/selwyn-park-cottage/selwyn-park-cottage (6).jpg',
                    'images/Portfolio/Renovation+Addition/selwyn-park-cottage/selwyn-park-cottage (7).jpg',
                    'images/Portfolio/Renovation+Addition/selwyn-park-cottage/selwyn-park-cottage (8).jpg',
                    'images/Portfolio/Renovation+Addition/selwyn-park-cottage/selwyn-park-cottage (9).jpg',
                    'images/Portfolio/Renovation+Addition/selwyn-park-cottage/selwyn-park-cottage (10).jpg',
                    'images/Portfolio/Renovation+Addition/selwyn-park-cottage/selwyn-park-cottage (11).jpg',
                    'images/Portfolio/Renovation+Addition/selwyn-park-cottage/selwyn-park-cottage (12).jpg',
                    'images/Portfolio/Renovation+Addition/selwyn-park-cottage/selwyn-park-cottage (13).jpg'
                ],
                hero_image: 'images/Portfolio/Renovation+Addition/selwyn-park-cottage/selwyn-park-cottage (Hero).jpg',
                type: 'renovation-addition'
            },
            {
                id: 'woodland',
                name: 'Woodland',
                images: [
                    'images/Portfolio/New Construction/Woodland/woodland-1-.jpg',
                    'images/Portfolio/New Construction/Woodland/woodland-3-.jpg',
                    'images/Portfolio/New Construction/Woodland/woodland-4-.jpg',
                    'images/Portfolio/New Construction/Woodland/woodland-5-.jpg',
                    'images/Portfolio/New Construction/Woodland/woodland-6-.jpg',
                    'images/Portfolio/New Construction/Woodland/woodland-7-.jpg',
                    'images/Portfolio/New Construction/Woodland/woodland-8-.jpg',
                    'images/Portfolio/New Construction/Woodland/woodland-9-.jpg',
                    'images/Portfolio/New Construction/Woodland/woodland-10-.jpg',
                    'images/Portfolio/New Construction/Woodland/woodland-11-.jpg'
                ],
                type: 'new-construction'
            },
            {
                id: 'split-level-makeover',
                name: 'split-level-makeover',
                images: [
                    'images/Portfolio/Renovation+Addition/split-level-makeover/splitlevelmakerover-1-.jpg',
                    'images/Portfolio/Renovation+Addition/split-level-makeover/splitlevelmakerover-2-.jpg',
                    'images/Portfolio/Renovation+Addition/split-level-makeover/splitlevelmakerover-3-.jpg',
                    'images/Portfolio/Renovation+Addition/split-level-makeover/splitlevelmakerover-4-.jpg',
                    'images/Portfolio/Renovation+Addition/split-level-makeover/splitlevelmakerover-5-.jpg',
                    'images/Portfolio/Renovation+Addition/split-level-makeover/splitlevelmakerover-6-.jpg',
                    'images/Portfolio/Renovation+Addition/split-level-makeover/splitlevelmakerover-7-.jpg',
                    'images/Portfolio/Renovation+Addition/split-level-makeover/splitlevelmakerover-8-.jpg',
                    'images/Portfolio/Renovation+Addition/split-level-makeover/splitlevelmakerover-10-.jpg',
                    'images/Portfolio/Renovation+Addition/split-level-makeover/splitlevelmakerover-11-.jpg',
                    'images/Portfolio/Renovation+Addition/split-level-makeover/splitlevelmakerover-12-.jpg',
                    'images/Portfolio/Renovation+Addition/split-level-makeover/splitlevelmakerover-13-.jpg',
                    'images/Portfolio/Renovation+Addition/split-level-makeover/splitlevelmakerover-14-.jpg',
                    'images/Portfolio/Renovation+Addition/split-level-makeover/splitlevelmakerover-15-.jpg',
                    'images/Portfolio/Renovation+Addition/split-level-makeover/splitlevelmakerover-16-.jpg',
                    'images/Portfolio/Renovation+Addition/split-level-makeover/splitlevelmakerover-17-.jpg',
                    'images/Portfolio/Renovation+Addition/split-level-makeover/splitlevelmakerover-18-.jpg',
                    'images/Portfolio/Renovation+Addition/split-level-makeover/splitlevelmakerover-19-.jpg',
                    'images/Portfolio/Renovation+Addition/split-level-makeover/splitlevelmakerover-20-.jpg',
                    'images/Portfolio/Renovation+Addition/split-level-makeover/splitlevelmakerover-21-.jpg',
                    'images/Portfolio/Renovation+Addition/split-level-makeover/splitlevelmakerover-22-.jpg',
                    'images/Portfolio/Renovation+Addition/split-level-makeover/splitlevelmakerover-23-.jpg',
                    'images/Portfolio/Renovation+Addition/split-level-makeover/splitlevelmakerover-24-.jpg',
                    'images/Portfolio/Renovation+Addition/split-level-makeover/splitlevelmakerover-25-.jpg',
                    'images/Portfolio/Renovation+Addition/split-level-makeover/splitlevelmakerover-26-.jpg',
                    'images/Portfolio/Renovation+Addition/split-level-makeover/splitlevelmakerover-27-.jpg',
                    'images/Portfolio/Renovation+Addition/split-level-makeover/splitlevelmakerover-28-.jpg',
                    'images/Portfolio/Renovation+Addition/split-level-makeover/splitlevelmakerover-29-.jpg',
                    'images/Portfolio/Renovation+Addition/split-level-makeover/splitlevelmakerover-30-.jpg',
                    'images/Portfolio/Renovation+Addition/split-level-makeover/splitlevelmakerover-31-.jpg',
                    'images/Portfolio/Renovation+Addition/split-level-makeover/splitlevelmakerover-32-.jpg'
                ],
                hero_image: 'images/Portfolio/Renovation+Addition/split-level-makeover/splitlevelmakerover-hero-.jpg',
                type: 'renovation-addition'
            },
            {
                id: 'ranch-renovation',
                name: 'ranch-renovation',
                images: [
                    'images/Portfolio/Renovation+Addition/ranch-renovation/ranch-renovation-1-.jpg',
                    'images/Portfolio/Renovation+Addition/ranch-renovation/ranch-renovation (2).JPG',
                    'images/Portfolio/Renovation+Addition/ranch-renovation/ranch-renovation-3-.jpg',
                    'images/Portfolio/Renovation+Addition/ranch-renovation/ranch-renovation (4).JPG',
                    'images/Portfolio/Renovation+Addition/ranch-renovation/ranch-renovation (5).JPG',
                    'images/Portfolio/Renovation+Addition/ranch-renovation/ranch-renovation-6-.jpg',
                    'images/Portfolio/Renovation+Addition/ranch-renovation/ranch-renovation-7-.jpg'
                ],
                hero_image: 'images/Portfolio/Renovation+Addition/ranch-renovation/ranch-renovation-hero-.jpg',
                type: 'renovation-addition'
            },
            {
                id: 'mid-century-modern-addition',
                name: 'mid-century-modern-addition + Renovation',
                images: [
                    'images/Portfolio/Renovation+Addition/mid-century-modern-addition/mid-century-modern-addition-renovation-1-.jpg',
                    'images/Portfolio/Renovation+Addition/mid-century-modern-addition/mid-century-modern-addition-renovation-2-.jpg',
                    'images/Portfolio/Renovation+Addition/mid-century-modern-addition/mid-century-modern-addition-renovation-3-.jpg',
                    'images/Portfolio/Renovation+Addition/mid-century-modern-addition/mid-century-modern-addition-renovation-4-.jpg',
                    'images/Portfolio/Renovation+Addition/mid-century-modern-addition/mid-century-modern-addition-renovation-5-.jpg',
                    'images/Portfolio/Renovation+Addition/mid-century-modern-addition/mid-century-modern-addition-renovation-6-.jpg',
                    'images/Portfolio/Renovation+Addition/mid-century-modern-addition/mid-century-modern-addition-renovation-7-.jpg',
                    'images/Portfolio/Renovation+Addition/mid-century-modern-addition/mid-century-modern-addition-renovation-8-.jpg',
                    'images/Portfolio/Renovation+Addition/mid-century-modern-addition/mid-century-modern-addition  Renovation (9).jpg',
                    'images/Portfolio/Renovation+Addition/mid-century-modern-addition/mid-century-modern-addition-renovation-10-.jpg',
                    'images/Portfolio/Renovation+Addition/mid-century-modern-addition/mid-century-modern-addition-renovaiton-7-.jpg',
                    'images/Portfolio/Renovation+Addition/mid-century-modern-addition/mid-century-modern-addition-renovaiton-8-.jpg',
                    'images/Portfolio/Renovation+Addition/mid-century-modern-addition/mid-century-modern-addition-renovaiton-9-.jpg'
                ],
                type: 'renovation-addition'
            },
            {
                id: 'williams-lake-house',
                name: 'Lake Norman House',
                images: [
                    'images/Portfolio/New Construction/lake-house/lakehouse-1-.jpg',
                    'images/Portfolio/New Construction/lake-house/lakehouse-9-.jpg',
                    'images/Portfolio/New Construction/lake-house/lakehouse-18-.jpg',
                    'images/Portfolio/New Construction/lake-house/lakehouse-19-.jpg',
                    'images/Portfolio/New Construction/lake-house/lakehouse-20-.jpg',
                    'images/Portfolio/New Construction/lake-house/lakehouse-21-.jpg',
                    'images/Portfolio/New Construction/lake-house/lakehouse-22-.jpg',
                    'images/Portfolio/New Construction/lake-house/lakehouse-23-.jpg',
                    'images/Portfolio/New Construction/lake-house/lakehouse-24-.jpg',
                    'images/Portfolio/New Construction/lake-house/lakehouse-25-.jpg',
                    'images/Portfolio/New Construction/lake-house/lakehouse-26-.jpg',
                    'images/Portfolio/New Construction/lake-house/lakehouse-27-.jpg',
                    'images/Portfolio/New Construction/lake-house/lakehouse-28-.jpg',
                    'images/Portfolio/New Construction/lake-house/lakehouse-29-.jpg',
                    'images/Portfolio/New Construction/lake-house/lakehouse-30-.jpg',
                    'images/Portfolio/New Construction/lake-house/lakehouse-31-.jpg',
                    'images/Portfolio/New Construction/lake-house/lakehouse-32-.jpg',
                    'images/Portfolio/New Construction/lake-house/lakehouse-33-.jpg',
                    'images/Portfolio/New Construction/lake-house/lakehouse-34-.jpg',
                    'images/Portfolio/New Construction/lake-house/lakehouse-35-.jpg',
                    'images/Portfolio/New Construction/lake-house/lakehouse-36-.jpg',
                    'images/Portfolio/New Construction/lake-house/lakehouse-37-.jpg',
                    'images/Portfolio/New Construction/lake-house/lakehouse-38-.jpg',
                    'images/Portfolio/New Construction/lake-house/lakehouse-39-.jpg',
                    'images/Portfolio/New Construction/lake-house/lakehouse-40-.jpg',
                    'images/Portfolio/New Construction/lake-house/lakehouse-41-.jpg',
                    'images/Portfolio/New Construction/lake-house/lakehouse-42-.jpg',
                    'images/Portfolio/New Construction/lake-house/lakehouse-43-.jpg',
                    'images/Portfolio/New Construction/lake-house/lakehouse-44-.jpg',
                    'images/Portfolio/New Construction/lake-house/lakehouse-45-.jpg',
                    'images/Portfolio/New Construction/lake-house/lakehouse-46-.jpg',
                    'images/Portfolio/New Construction/lake-house/lakehouse-47-.jpg',
                    'images/Portfolio/New Construction/lake-house/lakehouse-48-.jpg',
                    'images/Portfolio/New Construction/lake-house/lakehouse-49-.jpg',
                    'images/Portfolio/New Construction/lake-house/lakehouse-50-.jpg',
                    'images/Portfolio/New Construction/lake-house/lakehouse-51-.jpg',
                    'images/Portfolio/New Construction/lake-house/lakehouse-52-.jpg',
                    'images/Portfolio/New Construction/lake-house/lakehouse-53-.jpg'
                ],
                hero_image: 'images/Portfolio/New Construction/lake-house/lakehouse-hero-.jpg',
                type: 'new-construction'
            },
            {
                id: 'contemporary-french',
                name: 'contemporary-french',
                images: [
                    'images/Portfolio/New Construction/contemporary-french/contemporaryfrench (1).png',
                    'images/Portfolio/New Construction/contemporary-french/contemporaryfrench (2).png',
                    'images/Portfolio/New Construction/contemporary-french/contemporaryfrench (3).png',
                    'images/Portfolio/New Construction/contemporary-french/contemporaryfrench (4).png',
                    'images/Portfolio/New Construction/contemporary-french/contemporaryfrench (5).png',
                    'images/Portfolio/New Construction/contemporary-french/contemporaryfrench (6).png',
                    'images/Portfolio/New Construction/contemporary-french/contemporaryfrench (7).png',
                    'images/Portfolio/New Construction/contemporary-french/contemporaryfrench (8).png',
                    'images/Portfolio/New Construction/contemporary-french/contemporaryfrench (9).png',
                    'images/Portfolio/New Construction/contemporary-french/contemporaryfrench (10).png'
                ],
                hero_image: 'images/Portfolio/New Construction/contemporary-french/contemporaryfrench (39).png',
                type: 'new-construction'
            },
            {
                id: 'french-country',
                name: 'french-country',
                images: [
                    'images/Portfolio/New Construction/french-country/french-country (2).jpg',
                    'images/Portfolio/New Construction/french-country/french-country (3).jpg',
                    'images/Portfolio/New Construction/french-country/french-country (4).jpg',
                    'images/Portfolio/New Construction/french-country/french-country (5).jpg',
                    'images/Portfolio/New Construction/french-country/french-country (6).jpg',
                    'images/Portfolio/New Construction/french-country/french-country (7).jpg',
                    'images/Portfolio/New Construction/french-country/french-country (8).jpg',
                    'images/Portfolio/New Construction/french-country/french-country (9).jpg',
                    'images/Portfolio/New Construction/french-country/french-country (10).jpg',
                    'images/Portfolio/New Construction/french-country/french-country (11).jpg'
                ],
                hero_image: 'images/Portfolio/New Construction/french-country/french-country (Hero).jpg',
                type: 'new-construction'
            },
            {
                id: 'low-country-cabin',
                name: 'low-country-cabin',
                images: [
                    'images/Portfolio/New Construction/low-country-cabin/lowcountrycabin-1-.jpg',
                    'images/Portfolio/New Construction/low-country-cabin/lowcountrycabin-2-.jpg',
                    'images/Portfolio/New Construction/low-country-cabin/lowcountrycabin-4-.jpg',
                    'images/Portfolio/New Construction/low-country-cabin/lowcountrycabin-5-.jpg'
                ],
                hero_image: 'images/Portfolio/New Construction/low-country-cabin/lowcountrycabin-hero-.jpg',
                type: 'new-construction'
            },
            {
                id: 'melchor-residence',
                name: 'melchor-residence',
                images: [
                    'images/Portfolio/New Construction/melchor-residence/melchor-residence-1-.jpg',
                    'images/Portfolio/New Construction/melchor-residence/melchor-residence-2-.jpg',
                    'images/Portfolio/New Construction/melchor-residence/melchor-residence-3-.jpg',
                    'images/Portfolio/New Construction/melchor-residence/melchor-residence-4-.jpg',
                    'images/Portfolio/New Construction/melchor-residence/melchor-residence-5-.jpg',
                    'images/Portfolio/New Construction/melchor-residence/melchor-residence (6).jpg',
                    'images/Portfolio/New Construction/melchor-residence/melchor-residence-7-.jpg',
                    'images/Portfolio/New Construction/melchor-residence/melchor-residence-8-.jpg',
                    'images/Portfolio/New Construction/melchor-residence/melchor-residence-9-.jpg'
                ],
                hero_image: 'images/Portfolio/New Construction/melchor-residence/melchor-residence-hero-.jpg',
                type: 'new-construction'
            },
            {
                id: 'sabik',
                name: 'Sabik',
                images: [
                    'images/Portfolio/New Construction/Sabik/sabik-1-.jpg',
                    'images/Portfolio/New Construction/Sabik/sabik-3-.jpg',
                    'images/Portfolio/New Construction/Sabik/sabik-4-.jpg',
                    'images/Portfolio/New Construction/Sabik/sabik-5-.jpg',
                    'images/Portfolio/New Construction/Sabik/sabik-6-.jpg',
                    'images/Portfolio/New Construction/Sabik/sabik-7-.jpg',
                    'images/Portfolio/New Construction/Sabik/sabik-10-.jpg',
                    'images/Portfolio/New Construction/Sabik/sabik-11-.jpg',
                    'images/Portfolio/New Construction/Sabik/sabik-12-.jpg',
                    'images/Portfolio/New Construction/Sabik/sabik-13-.jpg'
                ],
                type: 'new-construction'
            },
            {
                id: 'shingle-style',
                name: 'shingle-style',
                images: [
                    'images/Portfolio/New Construction/shingle-style/Vermont.02.jpg'
                ],
                hero_image: 'images/Portfolio/New Construction/shingle-style/shingle-style (Hero).jpg',
                type: 'new-construction'
            },
            {
                id: 'dilworth-renovation',
                name: 'dilworth-renovation',
                images: [
                    'images/Portfolio/Renovation+Addition/dilworth-renovation/dilworthrenovation-1-.jpg',
                    'images/Portfolio/Renovation+Addition/dilworth-renovation/dilworthrenovation-2-.jpg',
                    'images/Portfolio/Renovation+Addition/dilworth-renovation/dilworthrenovation-3-.jpg',
                    'images/Portfolio/Renovation+Addition/dilworth-renovation/dilworthrenovation-4-.jpg',
                    'images/Portfolio/Renovation+Addition/dilworth-renovation/dilworthrenovation-5-.jpg',
                    'images/Portfolio/Renovation+Addition/dilworth-renovation/dilworthrenovation-6-.jpg',
                    'images/Portfolio/Renovation+Addition/dilworth-renovation/dilworthrenovation-7-.jpg',
                    'images/Portfolio/Renovation+Addition/dilworth-renovation/dilworthrenovation-8-.jpg',
                    'images/Portfolio/Renovation+Addition/dilworth-renovation/dilworthrenovation-9-.jpg',
                    'images/Portfolio/Renovation+Addition/dilworth-renovation/dilworthrenovation-10-.jpg',
                    'images/Portfolio/Renovation+Addition/dilworth-renovation/dilworthrenovation-11-.jpg',
                    'images/Portfolio/Renovation+Addition/dilworth-renovation/dilworthrenovation-12-.jpg',
                    'images/Portfolio/Renovation+Addition/dilworth-renovation/dilworthrenovation-13-.jpg'
                ],
                hero_image: 'images/Portfolio/Renovation+Addition/dilworth-renovation/dilworthrenovation-hero-.jpg',
                type: 'renovation-addition'
            },
            {
                id: 'heavy-timber-pool-house',
                name: 'heavy-timber-pool-house',
                images: [
                    'images/Portfolio/Renovation+Addition/heavy-timber-pool-house/heavy-timber_01.jpg',
                    'images/Portfolio/Renovation+Addition/heavy-timber-pool-house/IMG_0503.JPG',
                    'images/Portfolio/Renovation+Addition/heavy-timber-pool-house/IMG_0506.JPG',
                    'images/Portfolio/Renovation+Addition/heavy-timber-pool-house/IMG_0523.jpg',
                    'images/Portfolio/Renovation+Addition/heavy-timber-pool-house/IMG_0526.jpg',
                    'images/Portfolio/Renovation+Addition/heavy-timber-pool-house/IMG_0527.jpg',
                    'images/Portfolio/Renovation+Addition/heavy-timber-pool-house/IMG_0528.jpg',
                    'images/Portfolio/Renovation+Addition/heavy-timber-pool-house/IMG_0529.JPG',
                    'images/Portfolio/Renovation+Addition/heavy-timber-pool-house/IMG_0531.jpg',
                    'images/Portfolio/Renovation+Addition/heavy-timber-pool-house/IMG-0500.jpg'
                ],
                hero_image: 'images/Portfolio/Renovation+Addition/heavy-timber-pool-house/heavy-timber_01.jpg',
                type: 'renovation-addition'
            },
            {
                id: 'lake-house-renovation',
                name: 'lake-house-renovation',
                images: [
                    'images/Portfolio/Renovation+Addition/lake-house-renovation/DSC_3069.JPG',
                    'images/Portfolio/Renovation+Addition/lake-house-renovation/DSC_3088.JPG',
                    'images/Portfolio/Renovation+Addition/lake-house-renovation/DSC_3090.JPG',
                    'images/Portfolio/Renovation+Addition/lake-house-renovation/DSC_3100.JPG',
                    'images/Portfolio/Renovation+Addition/lake-house-renovation/DSC_3110.JPG',
                    'images/Portfolio/Renovation+Addition/lake-house-renovation/DSC_3112.JPG',
                    'images/Portfolio/Renovation+Addition/lake-house-renovation/DSC_3131.JPG',
                    'images/Portfolio/Renovation+Addition/lake-house-renovation/DSC_3185.JPG',
                    'images/Portfolio/Renovation+Addition/lake-house-renovation/DSC_3263.jpg'
                ],
                hero_image: 'images/Portfolio/Renovation+Addition/lake-house-renovation/DSC_3069.JPG',
                type: 'renovation-addition'
            },
            {
                id: 'screened-porch-addition',
                name: 'Screened Porch Addition',
                images: [
                    'images/Portfolio/Renovation+Addition/screened-porch-additon/DSC_0044.JPG',
                    'images/Portfolio/Renovation+Addition/screened-porch-additon/DSC_0045.JPG',
                    'images/Portfolio/Renovation+Addition/screened-porch-additon/DSC_0046.JPG',
                    'images/Portfolio/Renovation+Addition/screened-porch-additon/DSC_0047.JPG',
                    'images/Portfolio/Renovation+Addition/screened-porch-additon/DSC_0048.JPG',
                    'images/Portfolio/Renovation+Addition/screened-porch-additon/DSC_0049.JPG',
                    'images/Portfolio/Renovation+Addition/screened-porch-additon/DSC_0050.JPG',
                    'images/Portfolio/Renovation+Addition/screened-porch-additon/DSC_0051.JPG',
                    'images/Portfolio/Renovation+Addition/screened-porch-additon/DSC_0052.JPG',
                    'images/Portfolio/Renovation+Addition/screened-porch-additon/DSC_0053.JPG'
                ],
                hero_image: 'images/Portfolio/Renovation+Addition/screened-porch-additon/DSC_0044.JPG',
                type: 'renovation-addition'
            },
            {
                id: 'wine-pavilion',
                name: 'Wine Pavilion',
                images: [
                    'images/Portfolio/Renovation+Addition/wine-pavlion/DSC_1425.JPG',
                    'images/Portfolio/Renovation+Addition/wine-pavlion/DSC_1477.JPG',
                    'images/Portfolio/Renovation+Addition/wine-pavlion/DSC_1485.JPG',
                    'images/Portfolio/Renovation+Addition/wine-pavlion/WP2.jpg',
                    'images/Portfolio/Renovation+Addition/wine-pavlion/WP5.jpg',
                    'images/Portfolio/Renovation+Addition/wine-pavlion/WP6.jpg'
                ],
                hero_image: 'images/Portfolio/Renovation+Addition/wine-pavlion/DSC_1425.JPG',
                type: 'renovation-addition'
            },
            {
                id: 'myers-park-renovation',
                name: 'myers-park-renovation',
                images: [
                    'images/Portfolio/Renovation+Addition/myers-park-renovation/Front_After.jpg',
                    'images/Portfolio/Renovation+Addition/myers-park-renovation/Kitchen_After.jpg',
                    'images/Portfolio/Renovation+Addition/myers-park-renovation/Rear_After.jpg'
                ],
                hero_image: 'images/Portfolio/Renovation+Addition/myers-park-renovation/Front_After.jpg',
                type: 'renovation-addition'
            },
            {
                id: 'early-classical-facade-renovation',
                name: 'early-classical-facade-renovation',
                images: [
                    'images/Portfolio/Renovation+Addition/early-classical-facade-renovation/dsc_1370-rev.jpg',
                    'images/Portfolio/Renovation+Addition/early-classical-facade-renovation/DSC_2724.JPG',
                    'images/Portfolio/Renovation+Addition/early-classical-facade-renovation/DSC_2725.jpg'
                ],
                hero_image: 'images/Portfolio/Renovation+Addition/early-classical-facade-renovation/dsc_1370-rev.jpg',
                type: 'renovation-addition'
            },
            {
                id: 'laurel-conversion',
                name: 'laurel-conversion',
                images: [
                    'images/Portfolio/Renovation+Addition/laurel-conversion/DSC_3127.jpg'
                ],
                hero_image: 'images/Portfolio/Renovation+Addition/laurel-conversion/DSC_3127.jpg',
                type: 'renovation-addition'
            },
            {
                id: 'montibello-backyard-getaway',
                name: 'montibello-backyard-getaway',
                images: [
                    'images/Portfolio/Renovation+Addition/montibello-backyard-getaway/DSC_1371.jpg'
                ],
                hero_image: 'images/Portfolio/Renovation+Addition/montibello-backyard-getaway/DSC_1371.jpg',
                type: 'renovation-addition'
            },
            {
                id: 'pelham-woods-renovation',
                name: 'pelham-woods-renovation',
                images: [
                    'images/Portfolio/Renovation+Addition/pelham-woods-renovation/pelham-woods-renovation-hero-.jpg'
                ],
                hero_image: 'images/Portfolio/Renovation+Addition/pelham-woods-renovation/pelham-woods-renovation-hero-.jpg',
                type: 'renovation-addition'
            },
            {
                id: 'colonial-revival',
                name: 'colonial-revival',
                images: [
                    'images/Portfolio/Renovation+Addition/colonial-revival/FrontFacade.jpg'
                ],
                hero_image: 'images/Portfolio/Renovation+Addition/colonial-revival/FrontFacade.jpg',
                type: 'renovation-addition'
            },
            {
                id: 'cotswold-outdoor-entertainment',
                name: 'cotswold-outdoor-entertainment',
                images: [
                    'images/Portfolio/Renovation+Addition/cotswold-outdoor-entertainment/4116-faulkner-1.jpg'
                ],
                hero_image: 'images/Portfolio/Renovation+Addition/cotswold-outdoor-entertainment/4116-faulkner-1.jpg',
                type: 'renovation-addition'
            },
            {
                id: 'federal-makeover',
                name: 'federal-makeover',
                images: [
                    'images/Portfolio/Renovation+Addition/federal-makeover/DSC_0006.jpg'
                ],
                hero_image: 'images/Portfolio/Renovation+Addition/federal-makeover/DSC_0006.jpg',
                type: 'renovation-addition'
            }
        ];
    };

    // Load projects from file system structure
    const loadProjectsFromFileSystem = () => {
        projects = getDefaultProjects();
        // Expose projects globally for gallery modal
        window.portfolioProjects = projects;
        console.log('✅ Loaded projects from file system:', projects.length);
    };

    // Initialize projects
    loadProjectsFromFileSystem();

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
        
        // Use hero_image if available, otherwise use first image
        const heroImage = project.hero_image || (project.images && project.images.length > 0 ? project.images[0] : '');
        
        card.innerHTML = `
            <div class="project-image">
                <img src="${heroImage}" alt="${project.name}" loading="lazy" />
            </div>
            <div class="project-info">
                <h3>${project.name}</h3>
                <p class="project-type">${project.type}</p>
            </div>
        `;
        
        // Project cards now open modal instead of navigating to separate pages
        // Click event is handled by gallery-modal.js via event delegation
        
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
    
    console.log('✅ Portfolio page initialized');
});
