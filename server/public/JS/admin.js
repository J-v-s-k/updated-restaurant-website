document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('admin-login-form');
    const adminContent = document.getElementById('admin-content');
    const loginContainer = document.getElementById('login-form');
    const logoutBtn = document.getElementById('logout-btn');
    const background = document.querySelector('.background');
    const sidebarLinks = document.querySelectorAll('.sidebar a');
    const contentSections = document.querySelectorAll('.content-section');

    function updateSidebarCounts() {
        fetch('/api/dashboard-counts')
            .then(response => response.json())
            .then(counts => {
                Object.entries(counts).forEach(([category, count]) => {
                    const link = document.getElementById(`${category}-link`);
                    if (link) {
                        link.innerHTML = `${link.textContent.split(' ')[0]} <span class="count">${count}</span>`;
                    }
                });
            })
            .catch(error => console.error('Error fetching dashboard counts:', error));
    }

    function showAdminContent() {
        loginContainer.style.display = 'none';
        adminContent.style.display = 'block';
        background.style.filter = 'none';
        showContent('home');
        updateSidebarCounts();
    }

    function showLoginForm() {
        loginContainer.style.display = 'block';
        adminContent.style.display = 'none';
        background.style.filter = 'blur(5px)';
    }

    function checkAuthStatus() {
        const token = localStorage.getItem('adminToken');
        if (token) {
            fetch('/api/admin/verify', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.valid) {
                    showAdminContent();
                } else {
                    showLoginForm();
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showLoginForm();
            });
        } else {
            showLoginForm();
        }
    }

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        fetch('/api/admin/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.token) {
                localStorage.setItem('adminToken', data.token);
                showAdminContent();
            } else {
                alert('Invalid credentials. Please try again.');
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('Login failed. Please try again.');
        });
    });

    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('adminToken');
        showLoginForm();
    });

    function showContent(contentId) {
        contentSections.forEach(section => {
            section.style.display = 'none';
        });
        document.getElementById(contentId).style.display = 'block';

        sidebarLinks.forEach(link => {
            link.classList.remove('active');
        });
        document.getElementById(`${contentId}-link`).classList.add('active');

        if (contentId !== 'home') {
            fetchCategoryData(contentId);
        }
    }

    sidebarLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const contentId = e.target.getAttribute('href').substring(1);
            showContent(contentId);
        });
    });

    function fetchCategoryData(category) {
        const contentSection = document.getElementById(category);
        contentSection.innerHTML = '<p>Loading...</p>';

        fetch(`/api/${category}`)
            .then(response => response.json())
            .then(data => {
                contentSection.innerHTML = ''; // Clear loading message
                
                // Add category name and refresh button
                const categoryHeader = document.createElement('div');
                categoryHeader.className = 'category-header';
                categoryHeader.innerHTML = `
                    <h2>${category.replace('-', ' ').toUpperCase()}</h2>
                    <button class="refresh-btn" onclick="fetchCategoryData('${category}')">
                        <i class="fas fa-sync-alt"></i> Refresh
                    </button>
                `;
                contentSection.appendChild(categoryHeader);

                if (data.length === 0) {
                    contentSection.innerHTML += '<p>No data available for this category.</p>';
                } else {
                    const boxContainer = createBoxContainer(data);
                    contentSection.appendChild(boxContainer);
                }
                updateSidebarCounts();
            })
            .catch(error => {
                console.error('Error:', error);
                contentSection.innerHTML = '<p>Error loading data. Please try again.</p>';
            });
    }

    function createBoxContainer(data) {
        const boxContainer = document.createElement('div');
        boxContainer.className = 'box-container';

        data.forEach(item => {
            const box = document.createElement('div');
            box.className = 'data-box';

            // Create hover options
            const hoverOptions = document.createElement('div');
            hoverOptions.className = 'hover-options';
            hoverOptions.innerHTML = `
                <button class="complete-btn" title="Mark as Completed"><i class="fas fa-check"></i></button>
                <button class="delete-btn" title="Delete"><i class="fas fa-trash"></i></button>
            `;

            const content = Object.entries(item)
                .filter(([key]) => key !== '_id' && key !== '__v')
                .map(([key, value]) => {
                    return `<p><strong>${key}:</strong> ${value}</p>`;
                }).join('');

            box.innerHTML = content;
            box.appendChild(hoverOptions);
            boxContainer.appendChild(box);

            // Add event listeners for hover options
            const completeBtn = hoverOptions.querySelector('.complete-btn');
            const deleteBtn = hoverOptions.querySelector('.delete-btn');

            completeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                markAsCompleted(item._id, box);
            });

            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                deleteItem(item._id, box);
            });
        });

        return boxContainer;
    }

    function markAsCompleted(itemId, boxElement) {
        const category = boxElement.closest('.content-section').id;
        fetch(`/api/${category}/${itemId}/complete`, {
            method: 'POST',
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                boxElement.remove();
                updateSidebarCounts();
            } else {
                alert('Failed to mark as completed. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        });
    }

    function deleteItem(itemId, boxElement) {
        const category = boxElement.closest('.content-section').id;
        fetch(`/api/${category}/${itemId}`, {
            method: 'DELETE',
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                boxElement.remove();
                updateSidebarCounts();
            } else {
                alert('Failed to delete item. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        });
    }

    // Make fetchCategoryData globally accessible
    window.fetchCategoryData = fetchCategoryData;

    checkAuthStatus();
});
