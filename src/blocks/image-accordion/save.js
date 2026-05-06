/**
 * WordPress Dependencies
 */
import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

// block save function
const Save = props => {
    const { attributes } = props;
    const { height, gap, borderRadius, activeWidth, inactiveWidth, overlayColor } = attributes;

    const blockProps = useBlockProps.save({
        style: {
            '--accordion-height': `${height || 500}px`,
            '--accordion-gap': `${gap ?? 5}px`,
            '--accordion-radius': `${borderRadius ?? 15}px`,
            '--accordion-active-width': `${activeWidth || 50}%`,
            '--accordion-inactive-width': `${inactiveWidth || 20}%`,
            '--accordion-overlay': overlayColor || 'rgba(18, 100, 100, 0.6)'
        }
    });

    return (
        <div {...blockProps}>
            <div className="insignia-image-accordion">
                <InnerBlocks.Content />
            </div>
        </div>
    );
};

export default Save;
