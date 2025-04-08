document.addEventListener('DOMContentLoaded', function() {
    // Tab Navigation
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all tabs
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Show corresponding content
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
            
            // Hide search results when switching tabs
            document.getElementById('searchResults').style.display = 'none';
        });
    });
    
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    const clearSearch = document.getElementById('clearSearch');
    const searchResults = document.getElementById('searchResults');
    const searchResultsContent = document.getElementById('searchResultsContent');
    
    // Toggle search bar
    document.querySelector('.search-icon').addEventListener('click', function() {
        document.getElementById('show-search').checked = !document.getElementById('show-search').checked;
        if (document.getElementById('show-search').checked) {
            setTimeout(() => searchInput.focus(), 300);
        }
    });
    
    // Clear search
    clearSearch.addEventListener('click', function() {
        searchInput.value = '';
        searchResults.style.display = 'none';
        clearSearch.style.display = 'none';
    });
    
    // Perform search when typing
    searchInput.addEventListener('input', function() {
        const query = this.value.trim().toLowerCase();
        
        if (query.length >= 3) {
            performSearch(query);
            clearSearch.style.display = 'inline';
        } else {
            searchResults.style.display = 'none';
            clearSearch.style.display = query.length > 0 ? 'inline' : 'none';
        }
    });
    
    function performSearch(query) {
        // Hide tab contents
        tabContents.forEach(content => content.classList.remove('active'));
        
        // Build search results
        searchResultsContent.innerHTML = '';
        let resultsFound = false;
        
        // Search in Quick Start Guide
        const quickStartSections = document.querySelectorAll('#quick-start .help-section');
        
        quickStartSections.forEach(section => {
            const sectionTitle = section.querySelector('h3').textContent;
            const sectionItems = Array.from(section.querySelectorAll('li')).map(li => li.textContent);
            
            // Check if section title or any item contains the query
            const titleMatch = sectionTitle.toLowerCase().includes(query);
            const contentMatches = sectionItems.filter(item => item.toLowerCase().includes(query));
            
            if (titleMatch || contentMatches.length > 0) {
                resultsFound = true;
                
                // Create result element
                const resultEl = document.createElement('div');
                resultEl.className = 'help-section';
                
                // Create section header
                const headerEl = document.createElement('div');
                headerEl.className = 'section-header';
                
                const iconEl = document.createElement('i');
                iconEl.className = section.querySelector('.section-header i').className;
                
                const titleEl = document.createElement('h3');
                titleEl.textContent = sectionTitle;
                
                headerEl.appendChild(iconEl);
                headerEl.appendChild(titleEl);
                resultEl.appendChild(headerEl);
                
                // Create list of matched items
                const listEl = document.createElement('ol');
                
                sectionItems.forEach((item, index) => {
                    if (contentMatches.includes(item)) {
                        const itemEl = document.createElement('li');
                        // Highlight the matching text
                        itemEl.innerHTML = highlightText(item, query);
                        listEl.appendChild(itemEl);
                    }
                });
                
                resultEl.appendChild(listEl);
                searchResultsContent.appendChild(resultEl);
            }
        });
        
        // Search in User Guide
        const userGuideSections = document.querySelectorAll('#user-guide .user-guide-section');
        
        userGuideSections.forEach(section => {
            const sectionTitle = section.querySelector('h3').textContent;
            const sectionDesc = section.querySelector('p').textContent;
            
            const guides = section.querySelectorAll('.how-to-guide');
            let sectionMatches = false;
            let matchedGuides = [];
            
            guides.forEach(guide => {
                const guideTitle = guide.querySelector('h4').textContent;
                const guideItems = Array.from(guide.querySelectorAll('li')).map(li => li.textContent);
                
                // Check if guide title or any item contains the query
                const titleMatch = guideTitle.toLowerCase().includes(query);
                const contentMatches = guideItems.filter(item => item.toLowerCase().includes(query));
                
                if (titleMatch || contentMatches.length > 0) {
                    sectionMatches = true;
                    matchedGuides.push({
                        title: guideTitle,
                        items: guideItems,
                        contentMatches: contentMatches
                    });
                }
            });
            
            if (sectionMatches) {
                resultsFound = true;
                
                // Create result section
                const sectionEl = document.createElement('div');
                sectionEl.className = 'user-guide-section';
                
                const headerEl = document.createElement('div');
                headerEl.className = 'section-toggle';
                
                const titleEl = document.createElement('h3');
                titleEl.textContent = sectionTitle;
                
                const descEl = document.createElement('p');
                descEl.textContent = sectionDesc;
                
                headerEl.appendChild(titleEl);
                headerEl.appendChild(descEl);
                sectionEl.appendChild(headerEl);
                
                const contentEl = document.createElement('div');
                contentEl.className = 'section-content active';
                
                matchedGuides.forEach(guide => {
                    const guideEl = document.createElement('div');
                    guideEl.className = 'how-to-guide';
                    
                    const guideTitleEl = document.createElement('h4');
                    guideTitleEl.innerHTML = highlightText(guide.title, query);
                    guideEl.appendChild(guideTitleEl);
                    
                    const listEl = document.createElement('ol');
                    
                    guide.items.forEach((item, index) => {
                        const itemEl = document.createElement('li');
                        if (guide.contentMatches.includes(item)) {
                            itemEl.innerHTML = highlightText(item, query);
                        } else {
                            itemEl.textContent = item;
                        }
                        listEl.appendChild(itemEl);
                    });
                    
                    guideEl.appendChild(listEl);
                    contentEl.appendChild(guideEl);
                });
                
                sectionEl.appendChild(contentEl);
                searchResultsContent.appendChild(sectionEl);
            }
        });
        
        // Search in FAQ
        const faqItems = document.querySelectorAll('#faq .faq-item');
        let faqMatches = [];
        
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question span').textContent;
            const answer = item.querySelector('.faq-answer p').textContent;
            
            // Check if question or answer contains the query
            if (question.toLowerCase().includes(query) || answer.toLowerCase().includes(query)) {
                faqMatches.push({
                    question,
                    answer,
                    category: item.closest('.faq-section').querySelector('h3').textContent
                });
            }
        });
        
        if (faqMatches.length > 0) {
            resultsFound = true;
            
            // Group by category
            const categories = {};
            faqMatches.forEach(match => {
                if (!categories[match.category]) {
                    categories[match.category] = [];
                }
                categories[match.category].push(match);
            });
            
            // Create FAQ results section
            const faqSectionEl = document.createElement('div');
            faqSectionEl.innerHTML = '<h3>Frequently Asked Questions</h3>';
            faqSectionEl.className = 'faq-results';
            
            Object.entries(categories).forEach(([category, matches]) => {
                const categoryEl = document.createElement('div');
                categoryEl.className = 'faq-section';
                categoryEl.innerHTML = `<h3>${category}</h3>`;
                
                matches.forEach(match => {
                    const itemEl = document.createElement('div');
                    itemEl.className = 'faq-item';
                    
                    const questionEl = document.createElement('div');
                    questionEl.className = 'faq-question active';
                    questionEl.innerHTML = `
                        <span>${highlightText(match.question, query)}</span>
                        <i class="fas fa-chevron-down"></i>
                    `;
                    
                    const answerEl = document.createElement('div');
                    answerEl.className = 'faq-answer active';
                    answerEl.innerHTML = `<p>${highlightText(match.answer, query)}</p>`;
                    
                    itemEl.appendChild(questionEl);
                    itemEl.appendChild(answerEl);
                    categoryEl.appendChild(itemEl);
                });
                
                faqSectionEl.appendChild(categoryEl);
            });
            
            searchResultsContent.appendChild(faqSectionEl);
        }
        
        // Show no results message if needed
        if (!resultsFound) {
            const noResults = document.createElement('p');
            noResults.textContent = `No results found for '${query}'`;
            noResults.style.color = 'gray';
            noResults.style.textAlign = 'center';
            noResults.style.padding = '20px';
            searchResultsContent.appendChild(noResults);
        }
        
        // Show the search results
        searchResults.style.display = 'block';
    }
    
    function highlightText(text, query) {
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<span class="highlight">$1</span>');
    }
    
    // User Guide Section Toggles
    const sectionToggles = document.querySelectorAll('.section-toggle');
    
    sectionToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            this.classList.toggle('active');
            
            const sectionId = this.getAttribute('data-section');
            const content = document.getElementById(`${sectionId}-content`);
            
            if (content.classList.contains('active')) {
                content.classList.remove('active');
            } else {
                content.classList.add('active');
            }
        });
    });
    
    // FAQ Toggles
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            this.classList.toggle('active');
            
            const answer = this.nextElementSibling;
            answer.classList.toggle('active');
        });
    });
});
