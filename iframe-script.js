document.addEventListener('mouseover', function (e) {
        const target = e.target.closest('.info-icon');
        if (target) {
            const tooltip = target.querySelector('.tooltip');
            if (tooltip) {
                tooltip.style.left = '50%';
                tooltip.style.transform = 'translateX(-50%)';
                const rect = tooltip.getBoundingClientRect();
                if (rect.left < 10) {
                    tooltip.style.left = '0';
                    tooltip.style.transform = 'translateX(0)';
                } else if (rect.right > window.innerWidth - 10) {
                    tooltip.style.left = 'auto';
                    tooltip.style.right = '0';
                    tooltip.style.transform = 'translateX(0)';
                }
            }
        }
    });