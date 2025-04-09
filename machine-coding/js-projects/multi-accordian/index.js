const accordions = document.querySelectorAll('.accordion');
const accordionDescriptions = document.querySelectorAll('.accordion .description');
const multipleButton = document.querySelector('.checkbox'); // Checkbox to control single/multiple open

// Initial state: open first, close others
accordionDescriptions.forEach((desc, index) => {
    const accordion = desc.closest('.accordion');
    const expandIcon = accordion.querySelector('.expand-icon');
    const collapseIcon = accordion.querySelector('.collapse-icon');

    if (index !== 0) {
        desc.classList.add('hide');
        if (collapseIcon) collapseIcon.style.display = 'none';
        if (expandIcon) expandIcon.style.display = '';
    } else {
        if (collapseIcon) collapseIcon.style.display = '';
        if (expandIcon) expandIcon.style.display = 'none';
    }
});

// Click handler for each title
document.querySelectorAll('.accordion .title-section').forEach((titleSection) => {
    titleSection.addEventListener('click', function (e) {
        const clickedAccordion = e.currentTarget.closest('.accordion');
        const description = clickedAccordion.querySelector('.description');
        const expandIcon = clickedAccordion.querySelector('.expand-icon');
        const collapseIcon = clickedAccordion.querySelector('.collapse-icon');
        const isHidden = description.classList.contains('hide');

        if (multipleButton.checked) {
            // Allow multiple to stay open
            description.classList.toggle('hide', !isHidden);
            if (expandIcon) expandIcon.style.display = isHidden ? 'none' : '';
            if (collapseIcon) collapseIcon.style.display = isHidden ? '' : 'none';
        } else {
            // Single open mode: close all others
            accordions.forEach((accordion) => {
                const desc = accordion.querySelector('.description');
                const expIcon = accordion.querySelector('.expand-icon');
                const colIcon = accordion.querySelector('.collapse-icon');

                if (accordion === clickedAccordion) {
                    desc.classList.toggle('hide', !isHidden);
                    if (expIcon) expIcon.style.display = isHidden ? 'none' : '';
                    if (colIcon) colIcon.style.display = isHidden ? '' : 'none';
                } else {
                    desc.classList.add('hide');
                    if (expIcon) expIcon.style.display = '';
                    if (colIcon) colIcon.style.display = 'none';
                }
            });
        }
    });
});