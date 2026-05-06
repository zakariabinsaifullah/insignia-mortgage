import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

const DefaultIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" width="22" height="22">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
);

const Save = props => {
    const { attributes } = props;
    const { icon, blockStyle } = attributes;

    const blockProps = useBlockProps.save({
        style: blockStyle
    });

    return (
        <div {...blockProps}>
            <div className="timeline-icon">
                {icon?.url ? (
                    <img src={icon.url} alt={icon.alt || ''} />
                ) : (
                    <DefaultIcon />
                )}
            </div>
            <div className="timeline-content">
                <InnerBlocks.Content />
            </div>
        </div>
    );
};

export default Save;
