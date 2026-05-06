document.addEventListener('DOMContentLoaded', function () {
    const imageAccordionItems = document.querySelectorAll('.wp-block-insignia-image-accordion-item');

    if (imageAccordionItems && imageAccordionItems.length > 0) {
        imageAccordionItems.forEach(function (item) {
            item.addEventListener('click', function () {
                // Get parent accordion container
                const parentAccordion = item.closest('.wp-block-insignia-image-accordion');
                
                if (parentAccordion) {
                    // Remove active class from all siblings
                    const siblings = parentAccordion.querySelectorAll('.wp-block-insignia-image-accordion-item');
                    siblings.forEach(function (sibling) {
                        sibling.classList.remove('active');
                    });
                }
                
                // Add active class to clicked item
                item.classList.add('active');
            });
        });
    }
});
