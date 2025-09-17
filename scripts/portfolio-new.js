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
    let displayedProjects = [];
    let currentPage = 0;
    const PROJECTS_PER_PAGE = 8;

    // Static project data based on actual file system structure
    const getDefaultProjects = () => {
        return [
            // Featured projects - reordered as requested
            {
                id: 'williams-lake-house',
                name: 'Lake House',
                displayName: 'Lake House',
                images: [
                    'images/Portfolio/New Construction/lake-house/lakehouse-hero-.jpg',
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
                type: 'new-construction',
                description: 'Lakeside residence designed to maximize water views and outdoor living.',
                location: 'Charlotte, NC',
                year: '2023'
            },
            {
                id: 'melchor-residence',
                name: 'Melchor Residence',
                displayName: 'Melchor Residence',
                images: [
                    'images/Portfolio/New Construction/melchor-residence/melchor-residence-hero-.jpg',
                    'images/Portfolio/New Construction/melchor-residence/melchor-residence-1-.jpg',
                    'images/Portfolio/New Construction/melchor-residence/melchor-residence-2-.jpg',
                    'images/Portfolio/New Construction/melchor-residence/melchor-residence-3-.jpg',
                    'images/Portfolio/New Construction/melchor-residence/melchor-residence-4-.jpg',
                    'images/Portfolio/New Construction/melchor-residence/melchor-residence-5-.jpg',
                    'images/Portfolio/New Construction/melchor-residence/melchor-residence-6-.jpg',
                    'images/Portfolio/New Construction/melchor-residence/melchor-residence-7-.jpg',
                    'images/Portfolio/New Construction/melchor-residence/melchor-residence-8-.jpg',
                    'images/Portfolio/New Construction/melchor-residence/melchor-residence-9-.jpg',
                    'images/Portfolio/New Construction/melchor-residence/melchor-residence-10-.jpg',
                    'images/Portfolio/New Construction/melchor-residence/DSC_0046.JPG',
                    'images/Portfolio/New Construction/melchor-residence/DSC_0057.JPG'
                ],
                hero_image: 'images/Portfolio/New Construction/melchor-residence/melchor-residence-hero-.jpg',
                type: 'new-construction',
                description: 'Custom residential design blending modern amenities with timeless architectural elements.',
                location: 'Charlotte, NC',
                year: '2023'
            },
            {
                id: 'homeowner-haven',
                name: 'Homeowner Haven',
                displayName: 'Homeowner Haven',
                images: [
                    'images/Portfolio/Renovation+Addition/homeowner-haven/hero.png',
                    'images/Portfolio/Renovation+Addition/homeowner-haven/homeowner-haven-1-.jpg',
                    'images/Portfolio/Renovation+Addition/homeowner-haven/homeowner-haven-2-.jpg',
                    'images/Portfolio/Renovation+Addition/homeowner-haven/homeowner-haven-3-.jpg',
                    'images/Portfolio/Renovation+Addition/homeowner-haven/homeowner-haven-4-.jpg',
                    'images/Portfolio/Renovation+Addition/homeowner-haven/homeowner-haven-5-.jpg',
                    'images/Portfolio/Renovation+Addition/homeowner-haven/homeowner-haven-6-.jpg',
                    'images/Portfolio/Renovation+Addition/homeowner-haven/homeowner-haven-7-.jpg',
                    'images/Portfolio/Renovation+Addition/homeowner-haven/homeowner-haven-8-.jpg',
                    'images/Portfolio/Renovation+Addition/homeowner-haven/homeowner-haven-9-.jpg',
                    'images/Portfolio/Renovation+Addition/homeowner-haven/homeowner-haven-10-.jpg',
                    'images/Portfolio/Renovation+Addition/homeowner-haven/homeowner-haven-11-.jpg',
                    'images/Portfolio/Renovation+Addition/homeowner-haven/homeowner-haven-12-.jpg',
                    'images/Portfolio/Renovation+Addition/homeowner-haven/homeowner-haven-13-.jpg',
                    'images/Portfolio/Renovation+Addition/homeowner-haven/homeowner-haven-14-.jpg',
                    'images/Portfolio/Renovation+Addition/homeowner-haven/homeowner-haven-15-.jpg',
                    'images/Portfolio/Renovation+Addition/homeowner-haven/homeowner-haven-16-.jpg',
                    'images/Portfolio/Renovation+Addition/homeowner-haven/homeowner-haven-17-.jpg',
                    'images/Portfolio/Renovation+Addition/homeowner-haven/homeowner-haven-19-.jpg',
                    'images/Portfolio/Renovation+Addition/homeowner-haven/homeowner-haven-20-.jpg',
                    'images/Portfolio/Renovation+Addition/homeowner-haven/homeowner-haven-21-.jpg',
                    'images/Portfolio/Renovation+Addition/homeowner-haven/homeowner-haven-22-.jpg'
                ],
                hero_image: 'images/Portfolio/Renovation+Addition/homeowner-haven/hero.png',
                type: 'renovation-addition',
                description: 'Comprehensive home renovation creating a personalized haven for modern living.',
                location: 'Charlotte, NC',
                year: '2023'
            },
            {
                id: 'heavy-timber-pool-house',
                name: 'Heavy Timber Pool House',
                displayName: 'Heavy Timber Pool House',
                images: [
                    'images/Portfolio/Renovation+Addition/heavy-timber-pool-house/hero.png',
                    'images/Portfolio/Renovation+Addition/heavy-timber-pool-house/heavy-timber_01.jpg',
                    'images/Portfolio/Renovation+Addition/heavy-timber-pool-house/IMG_0503.JPG',
                    'images/Portfolio/Renovation+Addition/heavy-timber-pool-house/IMG_0506.JPG',
                    'images/Portfolio/Renovation+Addition/heavy-timber-pool-house/IMG_0523.jpg',
                    'images/Portfolio/Renovation+Addition/heavy-timber-pool-house/IMG_0526.jpg',
                    'images/Portfolio/Renovation+Addition/heavy-timber-pool-house/IMG_0527.jpg',
                    'images/Portfolio/Renovation+Addition/heavy-timber-pool-house/IMG_0528.jpg',
                    'images/Portfolio/Renovation+Addition/heavy-timber-pool-house/IMG_0529.JPG',
                    'images/Portfolio/Renovation+Addition/heavy-timber-pool-house/IMG_0531.jpg'
                ],
                hero_image: 'images/Portfolio/Renovation+Addition/heavy-timber-pool-house/hero.png',
                type: 'renovation-addition',
                description: 'Custom heavy-timber-pool-house addition with rustic elegance and modern amenities.',
                location: 'Charlotte, NC',
                year: '2023'
            },
            // Other projects continue below
            {
                id: 'modern-warehouse',
                name: 'Modern Warehouse',
                displayName: 'Modern Warehouse',
                images: [
                    'images/Portfolio/New Construction/modern-warehouse/modern-warehouse-hero-.jpg',
                    'images/Portfolio/New Construction/modern-warehouse/modern-warehouse-1-.jpg',
                    'images/Portfolio/New Construction/modern-warehouse/modern-warehouse-1-.jpeg',
                    'images/Portfolio/New Construction/modern-warehouse/modern-warehouse-3-.jpg',
                    'images/Portfolio/New Construction/modern-warehouse/modern-warehouse-4-.jpg',
                    'images/Portfolio/New Construction/modern-warehouse/modern-warehouse-5-.jpg',
                    'images/Portfolio/New Construction/modern-warehouse/modern-warehouse-6-.jpg',
                    'images/Portfolio/New Construction/modern-warehouse/modern-warehouse-7-.jpg'
                ],
                hero_image: 'images/Portfolio/New Construction/modern-warehouse/modern-warehouse-hero-.jpg',
                type: 'new-construction',
                description: 'Industrial-inspired modern home featuring open spaces and contemporary design.',
                location: 'Charlotte, NC',
                year: '2023'
            },
            {
                id: 'riverchase',
                name: 'Riverchase',
                images: [
                    'images/Portfolio/New Construction/Riverchase/riverchase-hero-.jpg',
                    'images/Portfolio/New Construction/Riverchase/riverchase-1-.jpg',
                    'images/Portfolio/New Construction/Riverchase/riverchase-2-.jpg',
                    'images/Portfolio/New Construction/Riverchase/riverchase-3-.jpg',
                    'images/Portfolio/New Construction/Riverchase/riverchase-5-.jpg',
                    'images/Portfolio/New Construction/Riverchase/riverchase-6-.jpg',
                    'images/Portfolio/New Construction/Riverchase/riverchase-7-.jpg',
                    'images/Portfolio/New Construction/Riverchase/riverchase-8-.jpg',
                    'images/Portfolio/New Construction/Riverchase/riverchase-9-.jpg'
                ],
                hero_image: 'images/Portfolio/New Construction/Riverchase/riverchase-hero-.jpg',
                type: 'new-construction',
                description: 'Elegant residential design with river views and sophisticated architectural details.',
                location: 'Charlotte, NC',
                year: '2023'
            },
            {
                id: 'selwyn-park-cottage',
                name: 'Selwyn Park Cottage',
                displayName: 'Selwyn Park Cottage',
                images: [
                    'images/Portfolio/Renovation+Addition/selwyn-park-cottage/selwyn-park-cottage-hero-.jpg',
                    'images/Portfolio/Renovation+Addition/selwyn-park-cottage/selwyn-park-cottage-1-.jpg',
                    'images/Portfolio/Renovation+Addition/selwyn-park-cottage/selwyn-park-cottage-2-.jpg',
                    'images/Portfolio/Renovation+Addition/selwyn-park-cottage/selwyn-park-cottage-3-.jpg',
                    'images/Portfolio/Renovation+Addition/selwyn-park-cottage/selwyn-park-cottage-4-.jpg',
                    'images/Portfolio/Renovation+Addition/selwyn-park-cottage/selwyn-park-cottage-5-.jpg',
                    'images/Portfolio/Renovation+Addition/selwyn-park-cottage/selwyn-park-cottage-6-.jpg',
                    'images/Portfolio/Renovation+Addition/selwyn-park-cottage/selwyn-park-cottage-7-.jpg',
                    'images/Portfolio/Renovation+Addition/selwyn-park-cottage/selwyn-park-cottage-8-.jpg',
                    'images/Portfolio/Renovation+Addition/selwyn-park-cottage/selwyn-park-cottage-9-.jpg',
                    'images/Portfolio/Renovation+Addition/selwyn-park-cottage/selwyn-park-cottage-10-.jpg',
                    'images/Portfolio/Renovation+Addition/selwyn-park-cottage/selwyn-park-cottage-11-.jpg',
                    'images/Portfolio/Renovation+Addition/selwyn-park-cottage/selwyn-park-cottage-12-.jpg',
                    'images/Portfolio/Renovation+Addition/selwyn-park-cottage/selwyn-park-cottage-13-.jpg'
                ],
                hero_image: 'images/Portfolio/Renovation+Addition/selwyn-park-cottage/selwyn-park-cottage-hero-.jpg',
                type: 'renovation-addition',
                description: 'Charming cottage renovation in Selwyn Park with period-appropriate updates.',
                location: 'Charlotte, NC',
                year: '2023'
            },
            {
                id: 'woodland',
                name: 'Woodland',
                images: [
                    'images/Portfolio/New Construction/Woodland/woodland-hero-.jpg',
                    'images/Portfolio/New Construction/Woodland/woodland-1-.jpg',
                    'images/Portfolio/New Construction/Woodland/woodland-3-.jpg',
                    'images/Portfolio/New Construction/Woodland/woodland-4-.jpg',
                    'images/Portfolio/New Construction/Woodland/woodland-5-.jpg',
                    'images/Portfolio/New Construction/Woodland/woodland-6-.jpg',
                    'images/Portfolio/New Construction/Woodland/woodland-7-.jpg',
                    'images/Portfolio/New Construction/Woodland/woodland-8-.jpg',
                    'images/Portfolio/New Construction/Woodland/woodland-9-.jpg',
                    'images/Portfolio/New Construction/Woodland/woodland-10-.jpg',
                    'images/Portfolio/New Construction/Woodland/woodland-11-.jpg',
                    'images/Portfolio/New Construction/Woodland/woodland-12-.jpg',
                    'images/Portfolio/New Construction/Woodland/woodland-13-.jpg',
                    'images/Portfolio/New Construction/Woodland/woodland-14-.jpg'
                ],
                hero_image: 'images/Portfolio/New Construction/Woodland/woodland-hero-.jpg',
                type: 'new-construction',
                description: 'Natural woodland setting home with organic design elements and forest integration.',
                location: 'Charlotte, NC',
                year: '2023'
            },
            {
                id: 'split-level-makeover',
                name: 'Split Level Makeover',
                displayName: 'Split Level Makeover',
                images: [
                    'images/Portfolio/Renovation+Addition/split-level-makeover/splitlevelmakerover-hero-.jpg',
                    'images/Portfolio/Renovation+Addition/split-level-makeover/splitlevelmakerover-1-.jpg',
                    'images/Portfolio/Renovation+Addition/split-level-makeover/splitlevelmakerover-2-.jpg',
                    'images/Portfolio/Renovation+Addition/split-level-makeover/splitlevelmakerover-3-.jpg',
                    'images/Portfolio/Renovation+Addition/split-level-makeover/splitlevelmakerover-4-.jpg',
                    'images/Portfolio/Renovation+Addition/split-level-makeover/splitlevelmakerover-5-.jpg',
                    'images/Portfolio/Renovation+Addition/split-level-makeover/splitlevelmakerover-6-.jpg',
                    'images/Portfolio/Renovation+Addition/split-level-makeover/splitlevelmakerover-7-.jpg',
                    'images/Portfolio/Renovation+Addition/split-level-makeover/splitlevelmakerover-8-.jpg',
                    'images/Portfolio/Renovation+Addition/split-level-makeover/splitlevelmakerover-9-.jpg',
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
                type: 'renovation-addition',
                description: 'Complete split-level home makeover with modern open concept design.',
                location: 'Charlotte, NC',
                year: '2023'
            },
            {
                id: 'ranch-renovation',
                name: 'Ranch Renovation',
                displayName: 'Ranch Renovation',
                images: [
                    'images/Portfolio/Renovation+Addition/ranch-renovation/ranch-renovation-hero-.jpg',
                    'images/Portfolio/Renovation+Addition/ranch-renovation/ranch-renovation-1-.jpg',
                    'images/Portfolio/Renovation+Addition/ranch-renovation/ranch-renovation (2).JPG',
                    'images/Portfolio/Renovation+Addition/ranch-renovation/ranch-renovation-3-.jpg',
                    'images/Portfolio/Renovation+Addition/ranch-renovation/ranch-renovation (4).JPG',
                    'images/Portfolio/Renovation+Addition/ranch-renovation/ranch-renovation (5).JPG',
                    'images/Portfolio/Renovation+Addition/ranch-renovation/ranch-renovation-6-.jpg',
                    'images/Portfolio/Renovation+Addition/ranch-renovation/ranch-renovation-7-.jpg'
                ],
                hero_image: 'images/Portfolio/Renovation+Addition/ranch-renovation/ranch-renovation-hero-.jpg',
                type: 'renovation-addition',
                description: 'Ranch-style home renovation with open concept living and modern amenities.',
                location: 'Charlotte, NC',
                year: '2023'
            },
            {
                id: 'mid-century-modern-addition',
                name: 'Mid-Century Modern Addition',
                displayName: 'Mid-Century Modern Addition + Renovation',
                images: [
                    'images/Portfolio/Renovation+Addition/mid-century-modern-addition/mid-century-modern-addition-renovation-hero-.jpg',
                    'images/Portfolio/Renovation+Addition/mid-century-modern-addition/mid-century-modern-addition-renovation-1-.jpg',
                    'images/Portfolio/Renovation+Addition/mid-century-modern-addition/mid-century-modern-addition-renovation-2-.jpg',
                    'images/Portfolio/Renovation+Addition/mid-century-modern-addition/mid-century-modern-addition-renovation-3-.jpg',
                    'images/Portfolio/Renovation+Addition/mid-century-modern-addition/mid-century-modern-addition-renovation-4-.jpg',
                    'images/Portfolio/Renovation+Addition/mid-century-modern-addition/mid-century-modern-addition-renovation-5-.jpg',
                    'images/Portfolio/Renovation+Addition/mid-century-modern-addition/mid-century-modern-addition-renovation-6-.jpg',
                    'images/Portfolio/Renovation+Addition/mid-century-modern-addition/mid-century-modern-addition-renovation-7-.jpg',
                    'images/Portfolio/Renovation+Addition/mid-century-modern-addition/mid-century-modern-addition-renovation-8-.jpg',
                    'images/Portfolio/Renovation+Addition/mid-century-modern-addition/mid-century-modern-addition-renovaiton-7-.jpg',
                    'images/Portfolio/Renovation+Addition/mid-century-modern-addition/mid-century-modern-addition-renovaiton-8-.jpg',
                    'images/Portfolio/Renovation+Addition/mid-century-modern-addition/mid-century-modern-addition-renovaiton-9-.jpg',
                    'images/Portfolio/Renovation+Addition/mid-century-modern-addition/mid-century-modern-addition-renovation-10-.jpg'
                ],
                hero_image: 'images/Portfolio/Renovation+Addition/mid-century-modern-addition/mid-century-modern-addition-renovation-hero-.jpg',
                type: 'renovation-addition',
                description: 'Mid-century modern addition preserving architectural character while expanding living space.',
                location: 'Charlotte, NC',
                year: '2023'
            },
            // Second tier - Projects with good hero images
            {
                id: 'contemporary-french',
                name: 'Contemporary French',
                displayName: 'Contemporary French',
                images: [
                    'images/Portfolio/New Construction/contemporary-french/contemporaryfrench-hero-.png',
                    'images/Portfolio/New Construction/contemporary-french/contemporaryfrench-1-.png',
                    'images/Portfolio/New Construction/contemporary-french/contemporaryfrench-3-.png',
                    'images/Portfolio/New Construction/contemporary-french/contemporaryfrench-4-.png',
                    'images/Portfolio/New Construction/contemporary-french/contemporaryfrench-5-.png',
                    'images/Portfolio/New Construction/contemporary-french/contemporaryfrench-6-.png',
                    'images/Portfolio/New Construction/contemporary-french/contemporaryfrench-7-.png',
                    'images/Portfolio/New Construction/contemporary-french/contemporaryfrench-8-.png',
                    'images/Portfolio/New Construction/contemporary-french/contemporaryfrench-9-.png',
                    'images/Portfolio/New Construction/contemporary-french/contemporaryfrench-10-.png',
                    'images/Portfolio/New Construction/contemporary-french/contemporaryfrench-11-.png',
                    'images/Portfolio/New Construction/contemporary-french/contemporaryfrench-12-.png',
                    'images/Portfolio/New Construction/contemporary-french/contemporaryfrench-13-.png',
                    'images/Portfolio/New Construction/contemporary-french/contemporaryfrench-14-.png',
                    'images/Portfolio/New Construction/contemporary-french/contemporaryfrench-15-.png',
                    'images/Portfolio/New Construction/contemporary-french/contemporaryfrench-16-.png',
                    'images/Portfolio/New Construction/contemporary-french/contemporaryfrench-17-.png',
                    'images/Portfolio/New Construction/contemporary-french/contemporaryfrench-18-.png',
                    'images/Portfolio/New Construction/contemporary-french/contemporaryfrench-19-.png',
                    'images/Portfolio/New Construction/contemporary-french/contemporaryfrench-20-.png',
                    'images/Portfolio/New Construction/contemporary-french/contemporaryfrench-21-.png',
                    'images/Portfolio/New Construction/contemporary-french/contemporaryfrench-22-.png',
                    'images/Portfolio/New Construction/contemporary-french/contemporaryfrench-23-.png',
                    'images/Portfolio/New Construction/contemporary-french/contemporaryfrench-24-.png',
                    'images/Portfolio/New Construction/contemporary-french/contemporaryfrench-25-.png',
                    'images/Portfolio/New Construction/contemporary-french/contemporaryfrench-26-.png',
                    'images/Portfolio/New Construction/contemporary-french/contemporaryfrench-27-.png',
                    'images/Portfolio/New Construction/contemporary-french/contemporaryfrench-28-.png',
                    'images/Portfolio/New Construction/contemporary-french/contemporaryfrench-29-.png',
                    'images/Portfolio/New Construction/contemporary-french/contemporaryfrench-30-.png',
                    'images/Portfolio/New Construction/contemporary-french/contemporaryfrench-31-.png',
                    'images/Portfolio/New Construction/contemporary-french/contemporaryfrench-32-.png',
                    'images/Portfolio/New Construction/contemporary-french/contemporaryfrench-33-.png',
                    'images/Portfolio/New Construction/contemporary-french/contemporaryfrench-34-.png',
                    'images/Portfolio/New Construction/contemporary-french/contemporaryfrench-35-.png'
                ],
                hero_image: 'images/Portfolio/New Construction/contemporary-french/contemporaryfrench-hero-.png',
                type: 'new-construction',
                description: 'Modern French-inspired residential design with clean lines and elegant proportions.',
                location: 'Charlotte, NC',
                year: '2023'
            },
            {
                id: 'french-country',
                name: 'French Country',
                displayName: 'French Country',
                images: [
                    'images/Portfolio/New Construction/french-country/french-country-hero-.jpg',
                    'images/Portfolio/New Construction/french-country/french-country-2-.jpg',
                    'images/Portfolio/New Construction/french-country/french-country-3-.jpg',
                    'images/Portfolio/New Construction/french-country/french-country-4-.jpg',
                    'images/Portfolio/New Construction/french-country/french-country-5-.jpg',
                    'images/Portfolio/New Construction/french-country/french-country-6-.jpg',
                    'images/Portfolio/New Construction/french-country/french-country-7-.jpg',
                    'images/Portfolio/New Construction/french-country/french-country-8-.jpg',
                    'images/Portfolio/New Construction/french-country/french-country-9-.jpg',
                    'images/Portfolio/New Construction/french-country/french-country-10-.jpg',
                    'images/Portfolio/New Construction/french-country/french-country-11-.jpg',
                    'images/Portfolio/New Construction/french-country/french-country-12-.jpg'
                ],
                hero_image: 'images/Portfolio/New Construction/french-country/french-country-hero-.jpg',
                type: 'new-construction',
                description: 'Charming french-country home featuring rustic elegance and traditional craftsmanship.',
                location: 'Charlotte, NC',
                year: '2023'
            },
            {
                id: 'low-country-cabin',
                name: 'Low Country Cabin',
                displayName: 'Low Country Cabin',
                images: [
                    'images/Portfolio/New Construction/low-country-cabin/lowcountrycabin-hero-.jpg',
                    'images/Portfolio/New Construction/low-country-cabin/lowcountrycabin-1-.jpg',
                    'images/Portfolio/New Construction/low-country-cabin/lowcountrycabin-2-.jpg',
                    'images/Portfolio/New Construction/low-country-cabin/lowcountrycabin-4-.jpg',
                    'images/Portfolio/New Construction/low-country-cabin/lowcountrycabin-5-.jpg'
                ],
                hero_image: 'images/Portfolio/New Construction/low-country-cabin/lowcountrycabin-hero-.jpg',
                type: 'new-construction',
                description: 'Cozy low-country-cabin design with natural materials and coastal influences.',
                location: 'Charlotte, NC',
                year: '2023'
            },
            {
                id: 'sabik',
                name: 'Modern Craftsman',
                images: [
                    'images/Portfolio/New Construction/Sabik/sabik-hero-.jpg',
                    'images/Portfolio/New Construction/Sabik/sabik-3-.jpg',
                    'images/Portfolio/New Construction/Sabik/sabik-5-.jpg',
                    'images/Portfolio/New Construction/Sabik/sabik-7-.jpg',
                    'images/Portfolio/New Construction/Sabik/sabik-10-.jpg',
                    'images/Portfolio/New Construction/Sabik/sabik-11-.jpg',
                    'images/Portfolio/New Construction/Sabik/sabik-12-.jpg',
                    'images/Portfolio/New Construction/Sabik/sabik-13-.jpg',
                    'images/Portfolio/New Construction/Sabik/sabik-14-.jpg',
                    'images/Portfolio/New Construction/Sabik/sabik-15-.jpg',
                    'images/Portfolio/New Construction/Sabik/sabik-16-.jpg',
                    'images/Portfolio/New Construction/Sabik/sabik-17-.jpg',
                    'images/Portfolio/New Construction/Sabik/sabik-18-.jpg'
                ],
                hero_image: 'images/Portfolio/New Construction/Sabik/sabik-hero-.jpg',
                type: 'new-construction',
                description: 'Contemporary home design featuring clean lines and modern living spaces.',
                location: 'Charlotte, NC',
                year: '2023'
            },
            {
                id: 'shingle-style',
                name: 'Shingle Style',
                displayName: 'Shingle Style',
                images: [
                    'images/Portfolio/New Construction/shingle-style/shingle-style-hero-.jpg'
                ],
                hero_image: 'images/Portfolio/New Construction/shingle-style/shingle-style-hero-.jpg',
                type: 'new-construction',
                description: 'Classic shingle-style architecture with traditional New England influences.',
                location: 'Charlotte, NC',
                year: '2023'
            },
            // Third tier - Remaining projects mixed together
            {
                id: 'dilworth-renovation',
                name: 'Dilworth Renovation',
                displayName: 'Dilworth Renovation',
                images: [
                    'images/Portfolio/Renovation+Addition/dilworth-renovation/dilworthrenovation-hero-.jpg',
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
                hero_image: 'images/Portfolio/Renovation+Addition/dilworth-renovation/dilworthrenovation-1-.jpg',
                type: 'renovation-addition',
                description: 'Comprehensive dilworth-renovation preserving neighborhood character while modernizing functionality.',
                location: 'Charlotte, NC',
                year: '2023'
            },
            {
                id: 'lake-house-renovation',
                name: 'Lake House Renovation',
                displayName: 'Lake House Renovation',
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
                type: 'renovation-addition',
                description: 'Lakeside home renovation maximizing water views and outdoor living opportunities.',
                location: 'Charlotte, NC',
                year: '2023'
            },
            {
                id: 'screened-porch-addition',
                name: 'Screened Porch Addition',
                images: [
                    'images/Portfolio/Renovation+Addition/screened-porch-additon/hero.JPG',
                    'images/Portfolio/Renovation+Addition/screened-porch-additon/DSC_0045.JPG',
                    'images/Portfolio/Renovation+Addition/screened-porch-additon/DSC_0046.JPG',
                    'images/Portfolio/Renovation+Addition/screened-porch-additon/DSC_0047.JPG',
                    'images/Portfolio/Renovation+Addition/screened-porch-additon/DSC_0048.JPG',
                    'images/Portfolio/Renovation+Addition/screened-porch-additon/DSC_0049.JPG',
                    'images/Portfolio/Renovation+Addition/screened-porch-additon/DSC_0050.JPG',
                    'images/Portfolio/Renovation+Addition/screened-porch-additon/DSC_0051.JPG',
                    'images/Portfolio/Renovation+Addition/screened-porch-additon/DSC_0052.JPG',
                    'images/Portfolio/Renovation+Addition/screened-porch-additon/DSC_0053.JPG',
                    'images/Portfolio/Renovation+Addition/screened-porch-additon/DSC_0054.JPG',
                    'images/Portfolio/Renovation+Addition/screened-porch-additon/DSC_0055.JPG',
                    'images/Portfolio/Renovation+Addition/screened-porch-additon/DSC_0056.JPG',
                    'images/Portfolio/Renovation+Addition/screened-porch-additon/DSC_0057.JPG',
                    'images/Portfolio/Renovation+Addition/screened-porch-additon/DSC_0058.JPG',
                    'images/Portfolio/Renovation+Addition/screened-porch-additon/DSC_0059.JPG',
                    'images/Portfolio/Renovation+Addition/screened-porch-additon/DSC_0060.JPG',
                    'images/Portfolio/Renovation+Addition/screened-porch-additon/DSC_0061.JPG',
                    'images/Portfolio/Renovation+Addition/screened-porch-additon/DSC_0062.JPG',
                    'images/Portfolio/Renovation+Addition/screened-porch-additon/DSC_0063.JPG',
                    'images/Portfolio/Renovation+Addition/screened-porch-additon/DSC_0064.JPG',
                    'images/Portfolio/Renovation+Addition/screened-porch-additon/DSC_0065.JPG',
                    'images/Portfolio/Renovation+Addition/screened-porch-additon/DSC_0066.JPG',
                    'images/Portfolio/Renovation+Addition/screened-porch-additon/DSC_0067.JPG',
                    'images/Portfolio/Renovation+Addition/screened-porch-additon/DSC_0068.JPG',
                    'images/Portfolio/Renovation+Addition/screened-porch-additon/DSC_0069.JPG',
                    'images/Portfolio/Renovation+Addition/screened-porch-additon/DSC_0070.JPG',
                    'images/Portfolio/Renovation+Addition/screened-porch-additon/DSC_0071.JPG',
                    'images/Portfolio/Renovation+Addition/screened-porch-additon/DSC_0072.JPG',
                    'images/Portfolio/Renovation+Addition/screened-porch-additon/DSC_0073.JPG',
                    'images/Portfolio/Renovation+Addition/screened-porch-additon/DSC_0074.JPG',
                    'images/Portfolio/Renovation+Addition/screened-porch-additon/DSC_0075.JPG',
                    'images/Portfolio/Renovation+Addition/screened-porch-additon/DSC_0076.JPG',
                    'images/Portfolio/Renovation+Addition/screened-porch-additon/DSC_0077.JPG',
                    'images/Portfolio/Renovation+Addition/screened-porch-additon/DSC_0078.JPG'
                ],
                hero_image: 'images/Portfolio/Renovation+Addition/screened-porch-additon/hero.JPG',
                type: 'renovation-addition',
                description: 'Screened porch addition creating year-round outdoor living space.',
                location: 'Charlotte, NC',
                year: '2023'
            },
            {
                id: 'wine-pavilion',
                name: 'Wine Pavilion',
                images: [
                    'images/Portfolio/Renovation+Addition/wine-pavlion/hero.png',
                    'images/Portfolio/Renovation+Addition/wine-pavlion/WP6.jpg',
                    'images/Portfolio/Renovation+Addition/wine-pavlion/DSC_1425.JPG',
                    'images/Portfolio/Renovation+Addition/wine-pavlion/DSC_1477.JPG',
                    'images/Portfolio/Renovation+Addition/wine-pavlion/DSC_1485.JPG',
                    'images/Portfolio/Renovation+Addition/wine-pavlion/WP2.jpg',
                    'images/Portfolio/Renovation+Addition/wine-pavlion/WP5.jpg'
                ],
                hero_image: 'images/Portfolio/Renovation+Addition/wine-pavlion/hero.png',
                type: 'renovation-addition',
                description: 'Custom wine pavilion addition for entertaining and wine storage.',
                location: 'Charlotte, NC',
                year: '2023'
            },
            {
                id: 'myers-park-renovation',
                name: 'Myers Park Renovation',
                displayName: 'Myers Park Renovation',
                images: [
                    'images/Portfolio/Renovation+Addition/myers-park-renovation/hero.jpg',
                    'images/Portfolio/Renovation+Addition/myers-park-renovation/1.jpg',
                    'images/Portfolio/Renovation+Addition/myers-park-renovation/2.jpg',
                    'images/Portfolio/Renovation+Addition/myers-park-renovation/Front_After.jpg',
                    'images/Portfolio/Renovation+Addition/myers-park-renovation/front_after-copy.jpg',
                    'images/Portfolio/Renovation+Addition/myers-park-renovation/kitchen_after-copy.jpg',
                    'images/Portfolio/Renovation+Addition/myers-park-renovation/rear_after-copy.jpg'
                ],
                hero_image: 'images/Portfolio/Renovation+Addition/myers-park-renovation/hero.jpg',
                type: 'renovation-addition',
                description: 'myers-park-renovation maintaining neighborhood character with modern updates.',
                location: 'Charlotte, NC',
                year: '2023'
            },
            {
                id: 'early-classical-facade-renovation',
                name: 'Early Classical Facade Renovation',
                displayName: 'Early Classical Facade Renovation',
                images: [
                    'images/Portfolio/Renovation+Addition/early-classical-facade-renovation/hero.jpg',
                    'images/Portfolio/Renovation+Addition/early-classical-facade-renovation/dsc_1370-rev.jpg',
                    'images/Portfolio/Renovation+Addition/early-classical-facade-renovation/DSC_2724.JPG'
                ],
                hero_image: 'images/Portfolio/Renovation+Addition/early-classical-facade-renovation/hero.jpg',
                type: 'renovation-addition',
                description: 'Early Classical facade restoration maintaining historical architectural integrity.',
                location: 'Charlotte, NC',
                year: '2023'
            },
            {
                id: 'laurel-conversion',
                name: 'Laurel Conversion',
                displayName: 'Laurel Conversion',
                images: [
                    'images/Portfolio/Renovation+Addition/laurel-conversion/Hero.JPG',
                    'images/Portfolio/Renovation+Addition/laurel-conversion/1.JPG',
                    'images/Portfolio/Renovation+Addition/laurel-conversion/2.JPG',
                    'images/Portfolio/Renovation+Addition/laurel-conversion/3.jpg'
                ],
                hero_image: 'images/Portfolio/Renovation+Addition/laurel-conversion/Hero.JPG',
                type: 'renovation-addition',
                description: 'Creative space conversion in Laurel neighborhood with modern functionality.',
                location: 'Charlotte, NC',
                year: '2023'
            },
            {
                id: 'montibello-backyard-getaway',
                name: 'Montibello Backyard Getaway',
                displayName: 'Montibello Backyard Getaway',
                images: [
                    'images/Portfolio/Renovation+Addition/montibello-backyard-getaway/Hero.JPG',
                    'images/Portfolio/Renovation+Addition/montibello-backyard-getaway/DSC_2143.JPG',
                    'images/Portfolio/Renovation+Addition/montibello-backyard-getaway/DSC_2155.JPG',
                    'images/Portfolio/Renovation+Addition/montibello-backyard-getaway/DSC_2167.JPG',
                    'images/Portfolio/Renovation+Addition/montibello-backyard-getaway/DSC_2172.JPG',
                    'images/Portfolio/Renovation+Addition/montibello-backyard-getaway/DSC_2180.JPG',
                    'images/Portfolio/Renovation+Addition/montibello-backyard-getaway/DSC_2195.JPG',
                    'images/Portfolio/Renovation+Addition/montibello-backyard-getaway/DSC_2205.JPG',
                    'images/Portfolio/Renovation+Addition/montibello-backyard-getaway/DSC_2216.JPG',
                    'images/Portfolio/Renovation+Addition/montibello-backyard-getaway/DSC_2231.JPG',
                    'images/Portfolio/Renovation+Addition/montibello-backyard-getaway/DSC_2239.JPG',
                    'images/Portfolio/Renovation+Addition/montibello-backyard-getaway/DSC_2243.JPG',
                    'images/Portfolio/Renovation+Addition/montibello-backyard-getaway/DSC_2247.JPG',
                    'images/Portfolio/Renovation+Addition/montibello-backyard-getaway/DSC_2257.JPG',
                    'images/Portfolio/Renovation+Addition/montibello-backyard-getaway/DSC_2272.JPG',
                    'images/Portfolio/Renovation+Addition/montibello-backyard-getaway/DSC_2277.JPG',
                    'images/Portfolio/Renovation+Addition/montibello-backyard-getaway/DSC_2278.JPG',
                    'images/Portfolio/Renovation+Addition/montibello-backyard-getaway/DSC_2287.JPG',
                    'images/Portfolio/Renovation+Addition/montibello-backyard-getaway/DSC_2319.JPG',
                    'images/Portfolio/Renovation+Addition/montibello-backyard-getaway/DSC_2327.JPG',
                    'images/Portfolio/Renovation+Addition/montibello-backyard-getaway/DSC_2336.JPG',
                    'images/Portfolio/Renovation+Addition/montibello-backyard-getaway/DSC_2355.JPG',
                    'images/Portfolio/Renovation+Addition/montibello-backyard-getaway/DSC_2363.JPG',
                    'images/Portfolio/Renovation+Addition/montibello-backyard-getaway/DSC_2364.JPG',
                    'images/Portfolio/Renovation+Addition/montibello-backyard-getaway/DSC_2369.JPG',
                    'images/Portfolio/Renovation+Addition/montibello-backyard-getaway/DSC_2371.JPG',
                    'images/Portfolio/Renovation+Addition/montibello-backyard-getaway/DSC_2372.JPG',
                    'images/Portfolio/Renovation+Addition/montibello-backyard-getaway/DSC_2374.JPG',
                    'images/Portfolio/Renovation+Addition/montibello-backyard-getaway/DSC_2378.JPG',
                    'images/Portfolio/Renovation+Addition/montibello-backyard-getaway/DSC_2379.JPG',
                    'images/Portfolio/Renovation+Addition/montibello-backyard-getaway/DSC_2380.JPG',
                    'images/Portfolio/Renovation+Addition/montibello-backyard-getaway/DSC_2394.JPG',
                    'images/Portfolio/Renovation+Addition/montibello-backyard-getaway/DSC_2403.JPG'
                ],
                hero_image: 'images/Portfolio/Renovation+Addition/montibello-backyard-getaway/Hero.JPG',
                type: 'renovation-addition',
                description: 'Backyard retreat addition creating a private outdoor sanctuary.',
                location: 'Charlotte, NC',
                year: '2023'
            },
            {
                id: 'pelham-woods-renovation',
                name: 'Pelham Woods Renovation',
                displayName: 'Pelham Woods Renovation',
                images: [
                    'images/Portfolio/Renovation+Addition/pelham-woods-renovation/pelham-woods-renovation-hero-.jpg',
                    'images/Portfolio/Renovation+Addition/pelham-woods-renovation/DSC_0101.JPG',
                    'images/Portfolio/Renovation+Addition/pelham-woods-renovation/DSC_0109.JPG',
                    'images/Portfolio/Renovation+Addition/pelham-woods-renovation/DSC_0116.JPG',
                    'images/Portfolio/Renovation+Addition/pelham-woods-renovation/DSC_0118.JPG',
                    'images/Portfolio/Renovation+Addition/pelham-woods-renovation/DSC_0124.JPG',
                    'images/Portfolio/Renovation+Addition/pelham-woods-renovation/DSC_0130.JPG',
                    'images/Portfolio/Renovation+Addition/pelham-woods-renovation/DSC_0132.JPG',
                    'images/Portfolio/Renovation+Addition/pelham-woods-renovation/DSC_0133.JPG',
                    'images/Portfolio/Renovation+Addition/pelham-woods-renovation/DSC_0138.JPG',
                    'images/Portfolio/Renovation+Addition/pelham-woods-renovation/DSC_0139.JPG'
                ],
                hero_image: 'images/Portfolio/Renovation+Addition/pelham-woods-renovation/pelham-woods-renovation-hero-.jpg',
                type: 'renovation-addition',
                description: 'pelham-woods-renovation with natural setting integration.',
                location: 'Charlotte, NC',
                year: '2023'
            },
            {
                id: 'colonial-revival',
                name: 'Colonial Revival',
                displayName: 'Colonial Revival',
                images: [
                    'images/Portfolio/Renovation+Addition/colonial-revival/FrontFacade.jpg',
                    'images/Portfolio/Renovation+Addition/colonial-revival/colonialrevival (1).JPG',
                    'images/Portfolio/Renovation+Addition/colonial-revival/colonialrevival (2).jpg',
                    'images/Portfolio/Renovation+Addition/colonial-revival/colonialrevival (3).JPG',
                    'images/Portfolio/Renovation+Addition/colonial-revival/colonialrevival (4).jpg',
                    'images/Portfolio/Renovation+Addition/colonial-revival/colonialrevival (5).JPG',
                    'images/Portfolio/Renovation+Addition/colonial-revival/colonialrevival (6).jpg',
                    'images/Portfolio/Renovation+Addition/colonial-revival/colonialrevival (7).JPG',
                    'images/Portfolio/Renovation+Addition/colonial-revival/colonialrevival (8).jpg',
                    'images/Portfolio/Renovation+Addition/colonial-revival/colonialrevival (9).JPG',
                    'images/Portfolio/Renovation+Addition/colonial-revival/colonialrevival (10).jpg',
                    'images/Portfolio/Renovation+Addition/colonial-revival/colonialrevival (11).jpg',
                    'images/Portfolio/Renovation+Addition/colonial-revival/colonialrevival (12).jpg',
                    'images/Portfolio/Renovation+Addition/colonial-revival/colonialrevival (13).jpg',
                    'images/Portfolio/Renovation+Addition/colonial-revival/colonialrevival (14).jpg',
                    'images/Portfolio/Renovation+Addition/colonial-revival/colonialrevival (15).JPG',
                    'images/Portfolio/Renovation+Addition/colonial-revival/colonialrevival (16).jpg',
                    'images/Portfolio/Renovation+Addition/colonial-revival/colonialrevival (17).jpg',
                    'images/Portfolio/Renovation+Addition/colonial-revival/colonialrevival (18).jpg',
                    'images/Portfolio/Renovation+Addition/colonial-revival/colonialrevival (19).JPG',
                    'images/Portfolio/Renovation+Addition/colonial-revival/colonialrevival (20).jpg'
                ],
                hero_image: 'images/Portfolio/Renovation+Addition/colonial-revival/FrontFacade.jpg',
                type: 'renovation-addition',
                description: 'Classic colonial-revival renovation preserving historical character while adding modern amenities.',
                location: 'Charlotte, NC',
                year: '2023'
            },
            {
                id: 'cotswold-outdoor-entertainment',
                name: 'Cotswold Outdoor Entertainment',
                displayName: 'Cotswold Outdoor Entertainment',
                images: [
                    'images/Portfolio/Renovation+Addition/cotswold-outdoor-entertainment/4116-faulkner-1.jpg',
                    'images/Portfolio/Renovation+Addition/cotswold-outdoor-entertainment/4116 Faulkner-2.jpg',
                    'images/Portfolio/Renovation+Addition/cotswold-outdoor-entertainment/4116 Faulkner-3.jpg',
                    'images/Portfolio/Renovation+Addition/cotswold-outdoor-entertainment/4116 Faulkner-4.jpg',
                    'images/Portfolio/Renovation+Addition/cotswold-outdoor-entertainment/4116 Faulkner-5.jpg',
                    'images/Portfolio/Renovation+Addition/cotswold-outdoor-entertainment/4116 Faulkner-6.jpg',
                    'images/Portfolio/Renovation+Addition/cotswold-outdoor-entertainment/4116 Faulkner-7.jpg',
                    'images/Portfolio/Renovation+Addition/cotswold-outdoor-entertainment/4116 Faulkner-8.jpg',
                    'images/Portfolio/Renovation+Addition/cotswold-outdoor-entertainment/4116 Faulkner-9.jpg',
                    'images/Portfolio/Renovation+Addition/cotswold-outdoor-entertainment/4116 Faulkner-10.jpg',
                    'images/Portfolio/Renovation+Addition/cotswold-outdoor-entertainment/4116 Faulkner-11.jpg',
                    'images/Portfolio/Renovation+Addition/cotswold-outdoor-entertainment/4116 Faulkner-12.jpg'
                ],
                hero_image: 'images/Portfolio/Renovation+Addition/cotswold-outdoor-entertainment/4116-faulkner-1.jpg',
                type: 'renovation-addition',
                description: 'Outdoor entertainment space addition with Cotswold architectural influences.',
                location: 'Charlotte, NC',
                year: '2023'
            },
            {
                id: 'federal-makeover',
                name: 'Federal Makeover',
                displayName: 'Federal Makeover',
                images: [
                    'images/Portfolio/Renovation+Addition/federal-makeover/hero.jpg',
                    'images/Portfolio/Renovation+Addition/federal-makeover/_DSC0144.jpg',
                    'images/Portfolio/Renovation+Addition/federal-makeover/_DSC0197.jpg',
                    'images/Portfolio/Renovation+Addition/federal-makeover/_DSC0208.jpg',
                    'images/Portfolio/Renovation+Addition/federal-makeover/_DSC0227.jpg',
                    'images/Portfolio/Renovation+Addition/federal-makeover/_DSC0272.jpg',
                    'images/Portfolio/Renovation+Addition/federal-makeover/1.jpg',
                    'images/Portfolio/Renovation+Addition/federal-makeover/2.jpg',
                    'images/Portfolio/Renovation+Addition/federal-makeover/3.JPG',
                    'images/Portfolio/Renovation+Addition/federal-makeover/DSC_0241.jpg'
                ],
                hero_image: 'images/Portfolio/Renovation+Addition/federal-makeover/hero.jpg',
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
        console.log('✅ Loaded projects from file system:', projects.length);
    };

    // Initialize projects
    loadProjectsFromFileSystem();
    console.log('Projects loaded:', projects);

    // ---- Filtering Logic ----
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectGrid = document.querySelector('#projectGrid');

    // Format project type for display
    const formatProjectType = (type) => {
        switch(type) {
            case 'new-construction':
                return 'New Construction';
            case 'renovation-addition':
                return 'Renovation + Addition';
            default:
                return type;
        }
    };

    // Check if device is mobile
    const isMobileDevice = () => {
        return window.innerWidth <= 768;
    };

    // Filter projects by type
    const filterProjects = (type) => {
        const filteredProjects = type === 'all' ? projects : projects.filter(project => project.type === type);
        displayProjects(filteredProjects);
        
        // Update active filter button
        filterButtons.forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-filter="${type}"]`).classList.add('active');
    };

    // Display projects in grid with mobile pagination
    const displayProjects = (projectsToShow) => {
        console.log('Displaying projects:', projectsToShow.length);
        if (!projectGrid) {
            console.error('Project grid not found!');
            return;
        }
        
        // Store the full filtered projects list
        displayedProjects = projectsToShow;
        
        // Reset pagination
        currentPage = 0;
        
        // Clear grid
        projectGrid.innerHTML = '';
        
        // Show initial projects
        loadMoreProjects();
        
        console.log('Projects displayed in grid');
    };

    // Load more projects (for mobile pagination)
    const loadMoreProjects = () => {
        if (!isMobileDevice()) {
            // On desktop, show all projects
            displayedProjects.forEach(project => {
                const projectCard = createProjectCard(project);
                projectGrid.appendChild(projectCard);
            });
            hideLoadMoreButton();
            return;
        }
        
        // On mobile, show paginated projects
        const startIndex = currentPage * PROJECTS_PER_PAGE;
        const endIndex = startIndex + PROJECTS_PER_PAGE;
        const projectsToShow = displayedProjects.slice(startIndex, endIndex);
        
        projectsToShow.forEach(project => {
            const projectCard = createProjectCard(project);
            projectGrid.appendChild(projectCard);
        });
        
        currentPage++;
        
        // Show/hide load more button
        if (endIndex >= displayedProjects.length) {
            hideLoadMoreButton();
        } else {
            showLoadMoreButton();
        }
        
        console.log(`Loaded ${projectsToShow.length} more projects. Total displayed: ${startIndex + projectsToShow.length}/${displayedProjects.length}`);
    };

    // Show load more button
    const showLoadMoreButton = () => {
        const loadMoreContainer = document.getElementById('loadMoreContainer');
        if (loadMoreContainer && isMobileDevice()) {
            loadMoreContainer.style.display = 'block';
        }
    };

    // Hide load more button
    const hideLoadMoreButton = () => {
        const loadMoreContainer = document.getElementById('loadMoreContainer');
        if (loadMoreContainer) {
            loadMoreContainer.style.display = 'none';
        }
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
                <h3>${project.displayName || project.name}</h3>
                <p class="project-type">${formatProjectType(project.type)}</p>
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

    // ---- Search Functionality ----
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        let currentFilter = 'all';
        let currentSearchTerm = '';

        // Function to perform search and filter
        const performSearchAndFilter = () => {
            let filteredProjects = projects;

            // Apply type filter
            if (currentFilter !== 'all') {
                filteredProjects = filteredProjects.filter(project => project.type === currentFilter);
            }

            // Apply search filter
            if (currentSearchTerm.trim()) {
                const searchTerm = currentSearchTerm.toLowerCase().trim();
                filteredProjects = filteredProjects.filter(project => {
                    const projectName = (project.displayName || project.name).toLowerCase();
                    const projectType = formatProjectType(project.type).toLowerCase();
                    const projectDescription = (project.description || '').toLowerCase();
                    
                    return projectName.includes(searchTerm) || 
                           projectType.includes(searchTerm) || 
                           projectDescription.includes(searchTerm);
                });
            }

            // Display filtered projects (will handle pagination automatically)
            displayProjects(filteredProjects);
        };

        // Search input event listener
        searchInput.addEventListener('input', (e) => {
            currentSearchTerm = e.target.value;
            performSearchAndFilter();
        });

        // Create new filter function that works with search
        const filterProjectsWithSearch = (type) => {
            currentFilter = type;
            performSearchAndFilter();
            
            // Update active filter button
            filterButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-pressed', 'false');
            });
            const activeButton = document.querySelector(`[data-filter="${type}"]`);
            if (activeButton) {
                activeButton.classList.add('active');
                activeButton.setAttribute('aria-pressed', 'true');
            }
        };

        // Update filter button event listeners to use the new function
        filterButtons.forEach(button => {
            button.removeEventListener('click', () => {
                const filterType = button.getAttribute('data-filter');
                filterProjects(filterType);
            });
            button.addEventListener('click', () => {
                const filterType = button.getAttribute('data-filter');
                filterProjectsWithSearch(filterType);
            });
        });

        logger.success('Search functionality initialized');
    } else {
        logger.warn('Search input not found - search functionality disabled');
    }

    // Initialize with all projects
    filterProjects('all');

    // ---- Load More Button Event Listener ----
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', (e) => {
            e.preventDefault();
            loadMoreProjects();
        });
        console.log('Load more button event listener added');
    } else {
        console.warn('Load more button not found');
    }

    // Handle window resize to update pagination
    window.addEventListener('resize', () => {
        // Re-display current filtered projects when screen size changes
        if (displayedProjects.length > 0) {
            displayProjects(displayedProjects);
        }
    });

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




