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
                name: 'Modern Warehouse',
                images: [
                    'images/Portfolio/New Construction/Modern Warehouse/Modern Warehouse (1).jpg',
                    'images/Portfolio/New Construction/Modern Warehouse/Modern Warehouse (3).jpg',
                    'images/Portfolio/New Construction/Modern Warehouse/Modern Warehouse (4).jpg',
                    'images/Portfolio/New Construction/Modern Warehouse/Modern Warehouse (5).jpg',
                    'images/Portfolio/New Construction/Modern Warehouse/Modern Warehouse (6).jpg',
                    'images/Portfolio/New Construction/Modern Warehouse/Modern Warehouse (7).jpg'
                ],
                hero_image: 'images/Portfolio/New Construction/Modern Warehouse/Modern Warehouse (Hero).jpg',
                type: 'New Construction',
                description: 'Industrial-inspired modern home featuring open spaces and contemporary design.',
                location: 'Charlotte, NC',
                year: '2023'
            },
            {
                id: 'homeowner-haven',
                name: 'Homeowner Haven',
                images: [
                    'images/Portfolio/Renovation+Addition/Homeowner Haven/Homeowner Haven (1).jpg',
                    'images/Portfolio/Renovation+Addition/Homeowner Haven/Homeowner Haven (2).jpg',
                    'images/Portfolio/Renovation+Addition/Homeowner Haven/Homeowner Haven (3).jpg',
                    'images/Portfolio/Renovation+Addition/Homeowner Haven/Homeowner Haven (4).jpg',
                    'images/Portfolio/Renovation+Addition/Homeowner Haven/Homeowner Haven (5).jpg',
                    'images/Portfolio/Renovation+Addition/Homeowner Haven/Homeowner Haven (6).jpg',
                    'images/Portfolio/Renovation+Addition/Homeowner Haven/Homeowner Haven (7).jpg',
                    'images/Portfolio/Renovation+Addition/Homeowner Haven/Homeowner Haven (8).jpg',
                    'images/Portfolio/Renovation+Addition/Homeowner Haven/Homeowner Haven (9).jpg',
                    'images/Portfolio/Renovation+Addition/Homeowner Haven/Homeowner Haven (10).jpg',
                    'images/Portfolio/Renovation+Addition/Homeowner Haven/Homeowner Haven (11).jpg',
                    'images/Portfolio/Renovation+Addition/Homeowner Haven/Homeowner Haven (12).jpg',
                    'images/Portfolio/Renovation+Addition/Homeowner Haven/Homeowner Haven (13).jpg',
                    'images/Portfolio/Renovation+Addition/Homeowner Haven/Homeowner Haven (14).jpg',
                    'images/Portfolio/Renovation+Addition/Homeowner Haven/Homeowner Haven (15).jpg',
                    'images/Portfolio/Renovation+Addition/Homeowner Haven/Homeowner Haven (16).jpg',
                    'images/Portfolio/Renovation+Addition/Homeowner Haven/Homeowner Haven (17).jpg',
                    'images/Portfolio/Renovation+Addition/Homeowner Haven/Homeowner Haven (19).jpg',
                    'images/Portfolio/Renovation+Addition/Homeowner Haven/Homeowner Haven (20).jpg',
                    'images/Portfolio/Renovation+Addition/Homeowner Haven/Homeowner Haven (21).jpg',
                    'images/Portfolio/Renovation+Addition/Homeowner Haven/Homeowner Haven (22).jpg'
                ],
                hero_image: 'images/Portfolio/Renovation+Addition/Homeowner Haven/Homeowner Haven (Hero).jpg',
                type: 'Renovation+Addition',
                description: 'Comprehensive home renovation creating a personalized haven for modern living.',
                location: 'Charlotte, NC',
                year: '2023'
            },
            {
                id: 'riverchase',
                name: 'Riverchase',
                images: [
                    'images/Portfolio/New Construction/Riverchase/riverchase (1).jpg',
                    'images/Portfolio/New Construction/Riverchase/riverchase (2).jpg',
                    'images/Portfolio/New Construction/Riverchase/riverchase (3).jpg',
                    'images/Portfolio/New Construction/Riverchase/riverchase (5).jpg',
                    'images/Portfolio/New Construction/Riverchase/riverchase (6).jpg',
                    'images/Portfolio/New Construction/Riverchase/riverchase (7).jpg',
                    'images/Portfolio/New Construction/Riverchase/riverchase (8).jpg',
                    'images/Portfolio/New Construction/Riverchase/riverchase (9).jpg'
                ],
                hero_image: 'images/Portfolio/New Construction/Riverchase/riverchase (Hero).jpg',
                type: 'New Construction',
                description: 'Elegant residential design with river views and sophisticated architectural details.',
                location: 'Charlotte, NC',
                year: '2023'
            },
            {
                id: 'selwyn-park-cottage',
                name: 'Selwyn Park Cottage',
                images: [
                    'images/Portfolio/Renovation+Addition/Selwyn Park Cottage/Selwyn Park Cottage (1).jpg',
                    'images/Portfolio/Renovation+Addition/Selwyn Park Cottage/Selwyn Park Cottage (2).jpg',
                    'images/Portfolio/Renovation+Addition/Selwyn Park Cottage/Selwyn Park Cottage (3).jpg',
                    'images/Portfolio/Renovation+Addition/Selwyn Park Cottage/Selwyn Park Cottage (4).jpg',
                    'images/Portfolio/Renovation+Addition/Selwyn Park Cottage/Selwyn Park Cottage (5).jpg',
                    'images/Portfolio/Renovation+Addition/Selwyn Park Cottage/Selwyn Park Cottage (6).jpg',
                    'images/Portfolio/Renovation+Addition/Selwyn Park Cottage/Selwyn Park Cottage (7).jpg',
                    'images/Portfolio/Renovation+Addition/Selwyn Park Cottage/Selwyn Park Cottage (8).jpg',
                    'images/Portfolio/Renovation+Addition/Selwyn Park Cottage/Selwyn Park Cottage (9).jpg',
                    'images/Portfolio/Renovation+Addition/Selwyn Park Cottage/Selwyn Park Cottage (10).jpg',
                    'images/Portfolio/Renovation+Addition/Selwyn Park Cottage/Selwyn Park Cottage (11).jpg',
                    'images/Portfolio/Renovation+Addition/Selwyn Park Cottage/Selwyn Park Cottage (12).jpg',
                    'images/Portfolio/Renovation+Addition/Selwyn Park Cottage/Selwyn Park Cottage (13).jpg'
                ],
                hero_image: 'images/Portfolio/Renovation+Addition/Selwyn Park Cottage/Selwyn Park Cottage (Hero).jpg',
                type: 'Renovation+Addition',
                description: 'Charming cottage renovation in Selwyn Park with period-appropriate updates.',
                location: 'Charlotte, NC',
                year: '2023'
            },
            {
                id: 'woodland',
                name: 'Woodland',
                images: [
                    'images/Portfolio/New Construction/Woodland/Woodland (1).jpg',
                    'images/Portfolio/New Construction/Woodland/Woodland (3).jpg',
                    'images/Portfolio/New Construction/Woodland/Woodland (4).jpg',
                    'images/Portfolio/New Construction/Woodland/Woodland (5).jpg',
                    'images/Portfolio/New Construction/Woodland/Woodland (6).jpg',
                    'images/Portfolio/New Construction/Woodland/Woodland (7).jpg',
                    'images/Portfolio/New Construction/Woodland/Woodland (8).jpg',
                    'images/Portfolio/New Construction/Woodland/Woodland (9).jpg',
                    'images/Portfolio/New Construction/Woodland/Woodland (10).jpg',
                    'images/Portfolio/New Construction/Woodland/Woodland (11).jpg',
                    'images/Portfolio/New Construction/Woodland/Woodland (12).jpg',
                    'images/Portfolio/New Construction/Woodland/Woodland (13).jpg',
                    'images/Portfolio/New Construction/Woodland/Woodland (14).jpg'
                ],
                hero_image: 'images/Portfolio/New Construction/Woodland/Woodland (Hero).jpg',
                type: 'New Construction',
                description: 'Natural woodland setting home with organic design elements and forest integration.',
                location: 'Charlotte, NC',
                year: '2023'
            },
            {
                id: 'split-level-makeover',
                name: 'Split Level Makeover',
                images: [
                    'images/Portfolio/Renovation+Addition/Split Level Makeover/Splitlevelmakerover (1).jpg',
                    'images/Portfolio/Renovation+Addition/Split Level Makeover/Splitlevelmakerover (2).jpg',
                    'images/Portfolio/Renovation+Addition/Split Level Makeover/Splitlevelmakerover (3).jpg',
                    'images/Portfolio/Renovation+Addition/Split Level Makeover/Splitlevelmakerover (4).jpg',
                    'images/Portfolio/Renovation+Addition/Split Level Makeover/Splitlevelmakerover (5).jpg',
                    'images/Portfolio/Renovation+Addition/Split Level Makeover/Splitlevelmakerover (6).jpg',
                    'images/Portfolio/Renovation+Addition/Split Level Makeover/Splitlevelmakerover (7).jpg',
                    'images/Portfolio/Renovation+Addition/Split Level Makeover/Splitlevelmakerover (8).jpg',
                    'images/Portfolio/Renovation+Addition/Split Level Makeover/Splitlevelmakerover (10).jpg',
                    'images/Portfolio/Renovation+Addition/Split Level Makeover/Splitlevelmakerover (11).jpg',
                    'images/Portfolio/Renovation+Addition/Split Level Makeover/Splitlevelmakerover (12).jpg',
                    'images/Portfolio/Renovation+Addition/Split Level Makeover/Splitlevelmakerover (13).jpg',
                    'images/Portfolio/Renovation+Addition/Split Level Makeover/Splitlevelmakerover (14).jpg',
                    'images/Portfolio/Renovation+Addition/Split Level Makeover/Splitlevelmakerover (15).jpg',
                    'images/Portfolio/Renovation+Addition/Split Level Makeover/Splitlevelmakerover (16).jpg',
                    'images/Portfolio/Renovation+Addition/Split Level Makeover/Splitlevelmakerover (17).jpg',
                    'images/Portfolio/Renovation+Addition/Split Level Makeover/Splitlevelmakerover (18).jpg',
                    'images/Portfolio/Renovation+Addition/Split Level Makeover/Splitlevelmakerover (19).jpg',
                    'images/Portfolio/Renovation+Addition/Split Level Makeover/Splitlevelmakerover (20).jpg',
                    'images/Portfolio/Renovation+Addition/Split Level Makeover/Splitlevelmakerover (21).jpg',
                    'images/Portfolio/Renovation+Addition/Split Level Makeover/Splitlevelmakerover (22).jpg',
                    'images/Portfolio/Renovation+Addition/Split Level Makeover/Splitlevelmakerover (23).jpg',
                    'images/Portfolio/Renovation+Addition/Split Level Makeover/Splitlevelmakerover (24).jpg',
                    'images/Portfolio/Renovation+Addition/Split Level Makeover/Splitlevelmakerover (25).jpg',
                    'images/Portfolio/Renovation+Addition/Split Level Makeover/Splitlevelmakerover (26).jpg',
                    'images/Portfolio/Renovation+Addition/Split Level Makeover/Splitlevelmakerover (27).jpg',
                    'images/Portfolio/Renovation+Addition/Split Level Makeover/Splitlevelmakerover (28).jpg',
                    'images/Portfolio/Renovation+Addition/Split Level Makeover/Splitlevelmakerover (29).jpg',
                    'images/Portfolio/Renovation+Addition/Split Level Makeover/Splitlevelmakerover (30).jpg',
                    'images/Portfolio/Renovation+Addition/Split Level Makeover/Splitlevelmakerover (31).jpg',
                    'images/Portfolio/Renovation+Addition/Split Level Makeover/Splitlevelmakerover (32).jpg'
                ],
                hero_image: 'images/Portfolio/Renovation+Addition/Split Level Makeover/Splitlevelmakerover (Hero).jpg',
                type: 'Renovation+Addition',
                description: 'Complete split-level home makeover with modern open concept design.',
                location: 'Charlotte, NC',
                year: '2023'
            },
            {
                id: 'ranch-renovation',
                name: 'Ranch Renovation',
                images: [
                    'images/Portfolio/Renovation+Addition/Ranch Renovation/Ranch Renovation (1).JPG',
                    'images/Portfolio/Renovation+Addition/Ranch Renovation/Ranch Renovation (2).JPG',
                    'images/Portfolio/Renovation+Addition/Ranch Renovation/Ranch Renovation (3).JPG',
                    'images/Portfolio/Renovation+Addition/Ranch Renovation/Ranch Renovation (4).JPG',
                    'images/Portfolio/Renovation+Addition/Ranch Renovation/Ranch Renovation (5).JPG',
                    'images/Portfolio/Renovation+Addition/Ranch Renovation/Ranch Renovation (6).JPG',
                    'images/Portfolio/Renovation+Addition/Ranch Renovation/Ranch Renovation (7).JPG'
                ],
                hero_image: 'images/Portfolio/Renovation+Addition/Ranch Renovation/Ranch Renovation (Hero).jpg',
                type: 'Renovation+Addition',
                description: 'Ranch-style home renovation with open concept living and modern amenities.',
                location: 'Charlotte, NC',
                year: '2023'
            },
            {
                id: 'mid-century-modern-addition',
                name: 'Mid Century Modern Addition + Renovation',
                images: [
                    'images/Portfolio/Renovation+Addition/Mid Century Modern Addition/Mid Century Modern Addition  Renovation (1).jpg',
                    'images/Portfolio/Renovation+Addition/Mid Century Modern Addition/Mid Century Modern Addition  Renovation (2).jpg',
                    'images/Portfolio/Renovation+Addition/Mid Century Modern Addition/Mid Century Modern Addition  Renovation (3).jpg',
                    'images/Portfolio/Renovation+Addition/Mid Century Modern Addition/Mid Century Modern Addition  Renovation (4).jpg',
                    'images/Portfolio/Renovation+Addition/Mid Century Modern Addition/Mid Century Modern Addition  Renovation (5).jpg',
                    'images/Portfolio/Renovation+Addition/Mid Century Modern Addition/Mid Century Modern Addition  Renovation (6).jpg',
                    'images/Portfolio/Renovation+Addition/Mid Century Modern Addition/Mid Century Modern Addition  Renovation (7).jpg',
                    'images/Portfolio/Renovation+Addition/Mid Century Modern Addition/Mid Century Modern Addition  Renovation (8).jpg',
                    'images/Portfolio/Renovation+Addition/Mid Century Modern Addition/Mid Century Modern Addition  Renovaiton (9).jpg',
                    'images/Portfolio/Renovation+Addition/Mid Century Modern Addition/Mid Century Modern Addition  Renovation (10).jpg'
                ],
                hero_image: 'images/Portfolio/Renovation+Addition/Mid Century Modern Addition/Mid Century Modern Addition  Renovation (Hero).jpg',
                type: 'Renovation+Addition',
                description: 'Mid-century modern addition preserving architectural character while expanding living space.',
                location: 'Charlotte, NC',
                year: '2023'
            },
            // Second tier - Projects with good hero images
            {
                id: 'williams-lake-house',
                name: 'Lake House',
                images: [
                    'images/Portfolio/New Construction/Lake House/LakeHouse (1).jpg',
                    'images/Portfolio/New Construction/Lake House/LakeHouse (9).jpg',
                    'images/Portfolio/New Construction/Lake House/LakeHouse (18).jpg',
                    'images/Portfolio/New Construction/Lake House/LakeHouse (19).jpg',
                    'images/Portfolio/New Construction/Lake House/LakeHouse (20).jpg',
                    'images/Portfolio/New Construction/Lake House/LakeHouse (21).jpg',
                    'images/Portfolio/New Construction/Lake House/LakeHouse (22).jpg',
                    'images/Portfolio/New Construction/Lake House/LakeHouse (23).jpg',
                    'images/Portfolio/New Construction/Lake House/LakeHouse (24).jpg',
                    'images/Portfolio/New Construction/Lake House/LakeHouse (25).jpg',
                    'images/Portfolio/New Construction/Lake House/LakeHouse (26).jpg',
                    'images/Portfolio/New Construction/Lake House/LakeHouse (27).jpg',
                    'images/Portfolio/New Construction/Lake House/LakeHouse (28).jpg',
                    'images/Portfolio/New Construction/Lake House/LakeHouse (29).jpg',
                    'images/Portfolio/New Construction/Lake House/LakeHouse (30).jpg',
                    'images/Portfolio/New Construction/Lake House/LakeHouse (31).jpg',
                    'images/Portfolio/New Construction/Lake House/LakeHouse (32).jpg',
                    'images/Portfolio/New Construction/Lake House/LakeHouse (33).jpg',
                    'images/Portfolio/New Construction/Lake House/LakeHouse (34).jpg',
                    'images/Portfolio/New Construction/Lake House/LakeHouse (35).jpg',
                    'images/Portfolio/New Construction/Lake House/LakeHouse (36).jpg',
                    'images/Portfolio/New Construction/Lake House/LakeHouse (37).jpg',
                    'images/Portfolio/New Construction/Lake House/LakeHouse (38).jpg',
                    'images/Portfolio/New Construction/Lake House/LakeHouse (39).jpg',
                    'images/Portfolio/New Construction/Lake House/LakeHouse (40).jpg',
                    'images/Portfolio/New Construction/Lake House/LakeHouse (41).jpg',
                    'images/Portfolio/New Construction/Lake House/LakeHouse (42).jpg',
                    'images/Portfolio/New Construction/Lake House/LakeHouse (43).jpg',
                    'images/Portfolio/New Construction/Lake House/LakeHouse (44).jpg',
                    'images/Portfolio/New Construction/Lake House/LakeHouse (45).jpg',
                    'images/Portfolio/New Construction/Lake House/LakeHouse (46).jpg',
                    'images/Portfolio/New Construction/Lake House/LakeHouse (47).jpg',
                    'images/Portfolio/New Construction/Lake House/LakeHouse (48).jpg',
                    'images/Portfolio/New Construction/Lake House/LakeHouse (49).jpg',
                    'images/Portfolio/New Construction/Lake House/LakeHouse (50).jpg',
                    'images/Portfolio/New Construction/Lake House/LakeHouse (51).jpg',
                    'images/Portfolio/New Construction/Lake House/LakeHouse (52).jpg',
                    'images/Portfolio/New Construction/Lake House/LakeHouse (53).jpg'
                ],
                hero_image: 'images/Portfolio/New Construction/Lake House/Lakehouse (Hero).jpg',
                type: 'New Construction',
                description: 'Lakeside residence designed to maximize water views and outdoor living.',
                location: 'Charlotte, NC',
                year: '2023'
            },
            {
                id: 'contemporary-french',
                name: 'Contemporary French',
                images: [
                    'images/Portfolio/New Construction/Contemporary French/contemporaryfrench  (1).png',
                    'images/Portfolio/New Construction/Contemporary French/contemporaryfrench  (3).png',
                    'images/Portfolio/New Construction/Contemporary French/contemporaryfrench  (4).png',
                    'images/Portfolio/New Construction/Contemporary French/contemporaryfrench  (5).png',
                    'images/Portfolio/New Construction/Contemporary French/contemporaryfrench  (6).png',
                    'images/Portfolio/New Construction/Contemporary French/contemporaryfrench  (7).png',
                    'images/Portfolio/New Construction/Contemporary French/contemporaryfrench  (8).png',
                    'images/Portfolio/New Construction/Contemporary French/contemporaryfrench  (9).png',
                    'images/Portfolio/New Construction/Contemporary French/contemporaryfrench  (10).png',
                    'images/Portfolio/New Construction/Contemporary French/contemporaryfrench  (11).png',
                    'images/Portfolio/New Construction/Contemporary French/contemporaryfrench  (12).png',
                    'images/Portfolio/New Construction/Contemporary French/contemporaryfrench  (13).png',
                    'images/Portfolio/New Construction/Contemporary French/contemporaryfrench  (14).png',
                    'images/Portfolio/New Construction/Contemporary French/contemporaryfrench  (15).png',
                    'images/Portfolio/New Construction/Contemporary French/contemporaryfrench  (16).png',
                    'images/Portfolio/New Construction/Contemporary French/contemporaryfrench  (17).png',
                    'images/Portfolio/New Construction/Contemporary French/contemporaryfrench  (18).png',
                    'images/Portfolio/New Construction/Contemporary French/contemporaryfrench  (19).png',
                    'images/Portfolio/New Construction/Contemporary French/contemporaryfrench  (20).png',
                    'images/Portfolio/New Construction/Contemporary French/contemporaryfrench  (21).png',
                    'images/Portfolio/New Construction/Contemporary French/contemporaryfrench  (22).png',
                    'images/Portfolio/New Construction/Contemporary French/contemporaryfrench  (23).png',
                    'images/Portfolio/New Construction/Contemporary French/contemporaryfrench  (24).png',
                    'images/Portfolio/New Construction/Contemporary French/contemporaryfrench  (25).png',
                    'images/Portfolio/New Construction/Contemporary French/contemporaryfrench  (26).png',
                    'images/Portfolio/New Construction/Contemporary French/contemporaryfrench  (27).png',
                    'images/Portfolio/New Construction/Contemporary French/contemporaryfrench  (28).png',
                    'images/Portfolio/New Construction/Contemporary French/contemporaryfrench  (29).png',
                    'images/Portfolio/New Construction/Contemporary French/contemporaryfrench  (30).png',
                    'images/Portfolio/New Construction/Contemporary French/contemporaryfrench  (31).png',
                    'images/Portfolio/New Construction/Contemporary French/contemporaryfrench  (32).png',
                    'images/Portfolio/New Construction/Contemporary French/contemporaryfrench  (33).png',
                    'images/Portfolio/New Construction/Contemporary French/contemporaryfrench  (34).png',
                    'images/Portfolio/New Construction/Contemporary French/contemporaryfrench  (35).png'
                ],
                hero_image: 'images/Portfolio/New Construction/Contemporary French/contemporaryfrench  (Hero).png',
                type: 'New Construction',
                description: 'Modern French-inspired residential design with clean lines and elegant proportions.',
                location: 'Charlotte, NC',
                year: '2023'
            },
            {
                id: 'french-country',
                name: 'French Country',
                images: [
                    'images/Portfolio/New Construction/French Country/French Country (2).jpg',
                    'images/Portfolio/New Construction/French Country/French Country (3).jpg',
                    'images/Portfolio/New Construction/French Country/French Country (4).jpg',
                    'images/Portfolio/New Construction/French Country/French Country (5).jpg',
                    'images/Portfolio/New Construction/French Country/French Country (6).jpg',
                    'images/Portfolio/New Construction/French Country/French Country (7).jpg',
                    'images/Portfolio/New Construction/French Country/French Country (8).jpg',
                    'images/Portfolio/New Construction/French Country/French Country (9).jpg',
                    'images/Portfolio/New Construction/French Country/French Country (10).jpg',
                    'images/Portfolio/New Construction/French Country/French Country (11).jpg',
                    'images/Portfolio/New Construction/French Country/French Country (12).jpg'
                ],
                hero_image: 'images/Portfolio/New Construction/French Country/French Country (Hero).jpg',
                type: 'New Construction',
                description: 'Charming French Country home featuring rustic elegance and traditional craftsmanship.',
                location: 'Charlotte, NC',
                year: '2023'
            },
            {
                id: 'low-country-cabin',
                name: 'Low Country Cabin',
                images: [
                    'images/Portfolio/New Construction/Low Country Cabin/LowCountryCabin (1).jpg',
                    'images/Portfolio/New Construction/Low Country Cabin/LowCountryCabin (2).jpg',
                    'images/Portfolio/New Construction/Low Country Cabin/LowCountryCabin (4).jpg',
                    'images/Portfolio/New Construction/Low Country Cabin/LowCountryCabin (5).jpg'
                ],
                hero_image: 'images/Portfolio/New Construction/Low Country Cabin/LowCountryCabin (Hero).jpg',
                type: 'New Construction',
                description: 'Cozy Low Country cabin design with natural materials and coastal influences.',
                location: 'Charlotte, NC',
                year: '2023'
            },
            {
                id: 'melchor-residence',
                name: 'Melchor Residence',
                images: [
                    'images/Portfolio/New Construction/Melchor Residence/Melchor Residence (1).jpg',
                    'images/Portfolio/New Construction/Melchor Residence/Melchor Residence (2).jpg',
                    'images/Portfolio/New Construction/Melchor Residence/Melchor Residence (3).jpg',
                    'images/Portfolio/New Construction/Melchor Residence/Melchor Residence (4).jpg',
                    'images/Portfolio/New Construction/Melchor Residence/Melchor Residence (5).jpg',
                    'images/Portfolio/New Construction/Melchor Residence/Melchor Residence (6).jpg',
                    'images/Portfolio/New Construction/Melchor Residence/Melchor Residence (7).jpg',
                    'images/Portfolio/New Construction/Melchor Residence/Melchor Residence (8).jpg',
                    'images/Portfolio/New Construction/Melchor Residence/Melchor Residence (9).jpg'
                ],
                hero_image: 'images/Portfolio/New Construction/Melchor Residence/Melchor Residence (Hero).jpg',
                type: 'New Construction',
                description: 'Custom residential design blending modern amenities with timeless architectural elements.',
                location: 'Charlotte, NC',
                year: '2023'
            },
            {
                id: 'sabik',
                name: 'Sabik',
                images: [
                    'images/Portfolio/New Construction/Sabik/Sabik (1).JPG',
                    'images/Portfolio/New Construction/Sabik/Sabik (3).JPG',
                    'images/Portfolio/New Construction/Sabik/Sabik (4).JPG',
                    'images/Portfolio/New Construction/Sabik/Sabik (5).JPG',
                    'images/Portfolio/New Construction/Sabik/Sabik (6).JPG',
                    'images/Portfolio/New Construction/Sabik/Sabik (7).JPG',
                    'images/Portfolio/New Construction/Sabik/Sabik (10).JPG',
                    'images/Portfolio/New Construction/Sabik/Sabik (11).JPG',
                    'images/Portfolio/New Construction/Sabik/Sabik (12).JPG',
                    'images/Portfolio/New Construction/Sabik/Sabik (13).JPG',
                    'images/Portfolio/New Construction/Sabik/Sabik (14).JPG',
                    'images/Portfolio/New Construction/Sabik/Sabik (15).JPG',
                    'images/Portfolio/New Construction/Sabik/Sabik (16).JPG',
                    'images/Portfolio/New Construction/Sabik/Sabik (17).JPG',
                    'images/Portfolio/New Construction/Sabik/Sabik (18).JPG'
                ],
                hero_image: 'images/Portfolio/New Construction/Sabik/Sabik (Hero).JPG',
                type: 'New Construction',
                description: 'Contemporary home design featuring clean lines and modern living spaces.',
                location: 'Charlotte, NC',
                year: '2023'
            },
            {
                id: 'shingle-style',
                name: 'Shingle Style',
                images: [
                    'images/Portfolio/New Construction/Shingle Style/Shingle Style (Hero).jpg'
                ],
                hero_image: 'images/Portfolio/New Construction/Shingle Style/Shingle Style (Hero).jpg',
                type: 'New Construction',
                description: 'Classic Shingle Style architecture with traditional New England influences.',
                location: 'Charlotte, NC',
                year: '2023'
            },
            // Third tier - Remaining projects mixed together
            {
                id: 'dilworth-renovation',
                name: 'Dilworth Renovation',
                images: [
                    'images/Portfolio/Renovation+Addition/Dilworth Renovation/MtVernon _03.jpg',
                    'images/Portfolio/Renovation+Addition/Dilworth Renovation/MtVernon _04.jpg',
                    'images/Portfolio/Renovation+Addition/Dilworth Renovation/MtVernon _05.jpg',
                    'images/Portfolio/Renovation+Addition/Dilworth Renovation/MtVernon _06.jpg',
                    'images/Portfolio/Renovation+Addition/Dilworth Renovation/MtVernon _07.jpg',
                    'images/Portfolio/Renovation+Addition/Dilworth Renovation/MtVernon _08.jpg',
                    'images/Portfolio/Renovation+Addition/Dilworth Renovation/MtVernon _09.jpg',
                    'images/Portfolio/Renovation+Addition/Dilworth Renovation/MtVernon _10.jpg',
                    'images/Portfolio/Renovation+Addition/Dilworth Renovation/MtVernon _11.jpg',
                    'images/Portfolio/Renovation+Addition/Dilworth Renovation/MtVernon _12.jpg',
                    'images/Portfolio/Renovation+Addition/Dilworth Renovation/MtVernon _13.jpg',
                    'images/Portfolio/Renovation+Addition/Dilworth Renovation/MtVernon _14.jpg',
                    'images/Portfolio/Renovation+Addition/Dilworth Renovation/MtVernon _15.jpg',
                    'images/Portfolio/Renovation+Addition/Dilworth Renovation/MtVernon _16.jpg',
                    'images/Portfolio/Renovation+Addition/Dilworth Renovation/MtVernon _17.jpg',
                    'images/Portfolio/Renovation+Addition/Dilworth Renovation/MtVernon _18.jpg'
                ],
                hero_image: 'images/Portfolio/Renovation+Addition/Dilworth Renovation/MtVernon _03.jpg',
                type: 'Renovation+Addition',
                description: 'Comprehensive Dilworth renovation preserving neighborhood character while modernizing functionality.',
                location: 'Charlotte, NC',
                year: '2023'
            },
            {
                id: 'heavy-timber-pool-house',
                name: 'Heavy Timber Pool House',
                images: [
                    'images/Portfolio/Renovation+Addition/Heavy Timber Pool House/Heavy+Timber_01.jpg',
                    'images/Portfolio/Renovation+Addition/Heavy Timber Pool House/IMG_0503.JPG',
                    'images/Portfolio/Renovation+Addition/Heavy Timber Pool House/IMG_0506.JPG',
                    'images/Portfolio/Renovation+Addition/Heavy Timber Pool House/IMG_0523.jpg',
                    'images/Portfolio/Renovation+Addition/Heavy Timber Pool House/IMG_0526.jpg',
                    'images/Portfolio/Renovation+Addition/Heavy Timber Pool House/IMG_0527.jpg',
                    'images/Portfolio/Renovation+Addition/Heavy Timber Pool House/IMG_0528.jpg',
                    'images/Portfolio/Renovation+Addition/Heavy Timber Pool House/IMG_0529.JPG',
                    'images/Portfolio/Renovation+Addition/Heavy Timber Pool House/IMG_0531.jpg',
                    'images/Portfolio/Renovation+Addition/Heavy Timber Pool House/IMG-0500.jpg'
                ],
                hero_image: 'images/Portfolio/Renovation+Addition/Heavy Timber Pool House/Heavy+Timber_01.jpg',
                type: 'Renovation+Addition',
                description: 'Custom heavy timber pool house addition with rustic elegance and modern amenities.',
                location: 'Charlotte, NC',
                year: '2023'
            },
            {
                id: 'lake-house-renovation',
                name: 'Lake House Renovation',
                images: [
                    'images/Portfolio/Renovation+Addition/Lake House Renovation/DSC_3069.JPG',
                    'images/Portfolio/Renovation+Addition/Lake House Renovation/DSC_3088.JPG',
                    'images/Portfolio/Renovation+Addition/Lake House Renovation/DSC_3090.JPG',
                    'images/Portfolio/Renovation+Addition/Lake House Renovation/DSC_3100.JPG',
                    'images/Portfolio/Renovation+Addition/Lake House Renovation/DSC_3110.JPG',
                    'images/Portfolio/Renovation+Addition/Lake House Renovation/DSC_3112.JPG',
                    'images/Portfolio/Renovation+Addition/Lake House Renovation/DSC_3131.JPG',
                    'images/Portfolio/Renovation+Addition/Lake House Renovation/DSC_3185.JPG',
                    'images/Portfolio/Renovation+Addition/Lake House Renovation/DSC_3263.jpg'
                ],
                hero_image: 'images/Portfolio/Renovation+Addition/Lake House Renovation/DSC_3069.JPG',
                type: 'Renovation+Addition',
                description: 'Lakeside home renovation maximizing water views and outdoor living opportunities.',
                location: 'Charlotte, NC',
                year: '2023'
            },
            {
                id: 'screened-porch-addition',
                name: 'Screened Porch Addition',
                images: [
                    'images/Portfolio/Renovation+Addition/Screened Porch Additon/DSC_0044.JPG',
                    'images/Portfolio/Renovation+Addition/Screened Porch Additon/DSC_0045.JPG',
                    'images/Portfolio/Renovation+Addition/Screened Porch Additon/DSC_0046.JPG',
                    'images/Portfolio/Renovation+Addition/Screened Porch Additon/DSC_0047.JPG',
                    'images/Portfolio/Renovation+Addition/Screened Porch Additon/DSC_0048.JPG',
                    'images/Portfolio/Renovation+Addition/Screened Porch Additon/DSC_0049.JPG',
                    'images/Portfolio/Renovation+Addition/Screened Porch Additon/DSC_0050.JPG',
                    'images/Portfolio/Renovation+Addition/Screened Porch Additon/DSC_0051.JPG',
                    'images/Portfolio/Renovation+Addition/Screened Porch Additon/DSC_0052.JPG',
                    'images/Portfolio/Renovation+Addition/Screened Porch Additon/DSC_0053.JPG',
                    'images/Portfolio/Renovation+Addition/Screened Porch Additon/DSC_0054.JPG',
                    'images/Portfolio/Renovation+Addition/Screened Porch Additon/DSC_0055.JPG',
                    'images/Portfolio/Renovation+Addition/Screened Porch Additon/DSC_0056.JPG',
                    'images/Portfolio/Renovation+Addition/Screened Porch Additon/DSC_0057.JPG',
                    'images/Portfolio/Renovation+Addition/Screened Porch Additon/DSC_0058.JPG',
                    'images/Portfolio/Renovation+Addition/Screened Porch Additon/DSC_0059.JPG',
                    'images/Portfolio/Renovation+Addition/Screened Porch Additon/DSC_0060.JPG',
                    'images/Portfolio/Renovation+Addition/Screened Porch Additon/DSC_0061.JPG',
                    'images/Portfolio/Renovation+Addition/Screened Porch Additon/DSC_0062.JPG',
                    'images/Portfolio/Renovation+Addition/Screened Porch Additon/DSC_0063.JPG',
                    'images/Portfolio/Renovation+Addition/Screened Porch Additon/DSC_0064.JPG',
                    'images/Portfolio/Renovation+Addition/Screened Porch Additon/DSC_0065.JPG',
                    'images/Portfolio/Renovation+Addition/Screened Porch Additon/DSC_0066.JPG',
                    'images/Portfolio/Renovation+Addition/Screened Porch Additon/DSC_0067.JPG',
                    'images/Portfolio/Renovation+Addition/Screened Porch Additon/DSC_0068.JPG',
                    'images/Portfolio/Renovation+Addition/Screened Porch Additon/DSC_0069.JPG',
                    'images/Portfolio/Renovation+Addition/Screened Porch Additon/DSC_0070.JPG',
                    'images/Portfolio/Renovation+Addition/Screened Porch Additon/DSC_0071.JPG',
                    'images/Portfolio/Renovation+Addition/Screened Porch Additon/DSC_0072.JPG',
                    'images/Portfolio/Renovation+Addition/Screened Porch Additon/DSC_0073.JPG',
                    'images/Portfolio/Renovation+Addition/Screened Porch Additon/DSC_0074.JPG',
                    'images/Portfolio/Renovation+Addition/Screened Porch Additon/DSC_0075.JPG',
                    'images/Portfolio/Renovation+Addition/Screened Porch Additon/DSC_0076.JPG',
                    'images/Portfolio/Renovation+Addition/Screened Porch Additon/DSC_0077.JPG',
                    'images/Portfolio/Renovation+Addition/Screened Porch Additon/DSC_0078.JPG'
                ],
                hero_image: 'images/Portfolio/Renovation+Addition/Screened Porch Additon/DSC_0044.JPG',
                type: 'Renovation+Addition',
                description: 'Screened porch addition creating year-round outdoor living space.',
                location: 'Charlotte, NC',
                year: '2023'
            },
            {
                id: 'wine-pavilion',
                name: 'Wine Pavilion',
                images: [
                    'images/Portfolio/Renovation+Addition/Wine Pavlion/DSC_1425.JPG',
                    'images/Portfolio/Renovation+Addition/Wine Pavlion/DSC_1477.JPG',
                    'images/Portfolio/Renovation+Addition/Wine Pavlion/DSC_1485.JPG',
                    'images/Portfolio/Renovation+Addition/Wine Pavlion/WP2.jpg',
                    'images/Portfolio/Renovation+Addition/Wine Pavlion/WP5.jpg',
                    'images/Portfolio/Renovation+Addition/Wine Pavlion/WP6.jpg'
                ],
                hero_image: 'images/Portfolio/Renovation+Addition/Wine Pavlion/WP6.jpg',
                type: 'Renovation+Addition',
                description: 'Custom wine pavilion addition for entertaining and wine storage.',
                location: 'Charlotte, NC',
                year: '2023'
            },
            {
                id: 'myers-park-renovation',
                name: 'Myers Park Renovation',
                images: [
                    'images/Portfolio/Renovation+Addition/Myers Park Renovation/Front_After.jpg',
                    'images/Portfolio/Renovation+Addition/Myers Park Renovation/Kitchen_After copy.jpg',
                    'images/Portfolio/Renovation+Addition/Myers Park Renovation/Rear_After copy.jpg'
                ],
                hero_image: 'images/Portfolio/Renovation+Addition/Myers Park Renovation/Front_After.jpg',
                type: 'Renovation+Addition',
                description: 'Myers Park renovation maintaining neighborhood character with modern updates.',
                location: 'Charlotte, NC',
                year: '2023'
            },
            {
                id: 'early-classical-facade-renovation',
                name: 'Early Classical Facade Renovation',
                images: [
                    'images/Portfolio/Renovation+Addition/Early Classical Facade Renovation/DSC_1370 REV.jpg',
                    'images/Portfolio/Renovation+Addition/Early Classical Facade Renovation/DSC_2724.JPG',
                    'images/Portfolio/Renovation+Addition/Early Classical Facade Renovation/DSC_2725.jpg'
                ],
                hero_image: 'images/Portfolio/Renovation+Addition/Early Classical Facade Renovation/DSC_1370 REV.jpg',
                type: 'Renovation+Addition',
                description: 'Early Classical facade restoration maintaining historical architectural integrity.',
                location: 'Charlotte, NC',
                year: '2023'
            },
            {
                id: 'laurel-conversion',
                name: 'Laurel Conversion',
                images: [
                    'images/Portfolio/Renovation+Addition/Laurel Conversion/DSC_3127.jpg'
                ],
                hero_image: 'images/Portfolio/Renovation+Addition/Laurel Conversion/DSC_3127.jpg',
                type: 'Renovation+Addition',
                description: 'Creative space conversion in Laurel neighborhood with modern functionality.',
                location: 'Charlotte, NC',
                year: '2023'
            },
            {
                id: 'montibello-backyard-getaway',
                name: 'Montibello Backyard Getaway',
                images: [
                    'images/Portfolio/Renovation+Addition/Montibello Backyard Getaway/DSC_1371.jpg'
                ],
                hero_image: 'images/Portfolio/Renovation+Addition/Montibello Backyard Getaway/DSC_1371.jpg',
                type: 'Renovation+Addition',
                description: 'Backyard retreat addition creating a private outdoor sanctuary.',
                location: 'Charlotte, NC',
                year: '2023'
            },
            {
                id: 'pelham-woods-renovation',
                name: 'Pelham Woods Renovation',
                images: [
                    'images/Portfolio/Renovation+Addition/Pelham Woods Renovation/Pelham Woods Renovation (Hero).jpg'
                ],
                hero_image: 'images/Portfolio/Renovation+Addition/Pelham Woods Renovation/Pelham Woods Renovation (Hero).jpg',
                type: 'Renovation+Addition',
                description: 'Pelham Woods renovation with natural setting integration.',
                location: 'Charlotte, NC',
                year: '2023'
            },
            {
                id: 'colonial-revival',
                name: 'Colonial Revival',
                images: [
                    'images/Portfolio/Renovation+Addition/Colonial Revival/FrontFacade.jpg'
                ],
                hero_image: 'images/Portfolio/Renovation+Addition/Colonial Revival/FrontFacade.jpg',
                type: 'Renovation+Addition',
                description: 'Classic Colonial Revival renovation preserving historical character while adding modern amenities.',
                location: 'Charlotte, NC',
                year: '2023'
            },
            {
                id: 'cotswold-outdoor-entertainment',
                name: 'Cotswold Outdoor Entertainment',
                images: [
                    'images/Portfolio/Renovation+Addition/Cotswold Outdoor Entertainment/4116+Faulkner-1.jpg'
                ],
                hero_image: 'images/Portfolio/Renovation+Addition/Cotswold Outdoor Entertainment/4116+Faulkner-1.jpg',
                type: 'Renovation+Addition',
                description: 'Outdoor entertainment space addition with Cotswold architectural influences.',
                location: 'Charlotte, NC',
                year: '2023'
            },
            {
                id: 'federal-makeover',
                name: 'Federal Makeover',
                images: [
                    'images/Portfolio/Renovation+Addition/Federal Makeover/DSC_0006.jpg'
                ],
                hero_image: 'images/Portfolio/Renovation+Addition/Federal Makeover/DSC_0006.jpg',
                type: 'Renovation+Addition',
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



