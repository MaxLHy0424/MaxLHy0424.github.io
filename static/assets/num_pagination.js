var itemsPerPage = 10;
var custompages = 0;
var xmlUrl = `${window.location.origin}/rss.xml`;
function getCurrentPage() {
    const currentUrl = window.location.href;
    const match = currentUrl.match(/page(\d+)\.html/);
    return match ? parseInt(match[1]) : 1;
}
function appendPageLink(pagination, pageNumber, currentPage) {
    var pageLink = document.createElement('a');
    pageLink.href = pageNumber === 1 ? `${window.location.origin}` : `${window.location.origin}/page${pageNumber}.html`;
    pageLink.textContent = pageNumber;
    if (pageNumber === currentPage) {
        pageLink.classList.add('current-page');
    }
    pagination.insertBefore(pageLink, pagination.children[pagination.children.length - 1]);
}
function appendDots(pagination) {
    var dots = document.createElement('span');
    dots.textContent = '...';
    pagination.insertBefore(dots, pagination.children[pagination.children.length - 1]);
}
function updatePagination(totalPages, currentPage) {
    var pagination = document.querySelector('.pagination');
    while (pagination.children.length > 2) {
        pagination.removeChild(pagination.children[1]);
    }
    if (totalPages <= 10) {
        for (var i = 1; i <= totalPages; i++) {
            appendPageLink(pagination, i, currentPage);
        }
    } else {
        appendPageLink(pagination, 1, currentPage);
        appendPageLink(pagination, 2, currentPage);
        appendPageLink(pagination, 3, currentPage);
        if (currentPage > 5) {
            appendDots(pagination);
        }
        var startPage = Math.max(4, currentPage - 2);
        var endPage = Math.min(totalPages - 3, currentPage + 2);
        for (var i = startPage; i <= endPage; i++) {
            appendPageLink(pagination, i, currentPage);
        }
        if (currentPage < totalPages - 4) {
            appendDots(pagination);
        }
        appendPageLink(pagination, totalPages - 2, currentPage);
        appendPageLink(pagination, totalPages - 1, currentPage);
        appendPageLink(pagination, totalPages, currentPage);
    }
    var style = document.createElement('style');
    style.textContent = `
        .pagination a.current-page {
            font-weight: bold;
            color: #58A6FF;
            font-size: 18px;
            border-color: #4CC2FF;
        }
    `;
    document.head.appendChild(style);
}
fetch(xmlUrl)
    .then(response => response.text())
    .then(data => {
        var parser = new DOMParser();
        var xmlDoc = parser.parseFromString(data, "text/xml");
        var items = xmlDoc.getElementsByTagName("item");
        var itemslength = items.length - custompages;
        if (itemslength <= itemsPerPage) {
            return;
        }
        var totalPages = Math.ceil(itemslength / itemsPerPage);
        var currentPage = getCurrentPage();
        updatePagination(totalPages, currentPage);
    })
    .catch(error => console.error('Error fetching XML:', error));