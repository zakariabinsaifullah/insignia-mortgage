import { useBlockProps, useInnerBlocksProps, MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { Fragment, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import Inspector from './inspector';

const INNER_TEMPLATE = [['core/paragraph', { placeholder: 'Add content here…' }]];

const DefaultIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" width="22" height="22">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
);

const Edit = props => {
    const { attributes, setAttributes, isSelected } = props;
    const { icon, contentGap, iconBgColor } = attributes;

    const cssCustomProperties = {
        ...(contentGap && { '--item-gap': `${contentGap}px` }),
        ...(iconBgColor && { '--icon-bg': iconBgColor })
    };

    const blockProps = useBlockProps({
        style: cssCustomProperties
    });

    useEffect(() => {
        setAttributes({ blockStyle: cssCustomProperties });
    }, [contentGap, iconBgColor]);

    const innerBlockProps = useInnerBlocksProps(
        { className: 'timeline-content' },
        {
            template: INNER_TEMPLATE,
            templateLock: false
        }
    );

    return (
        <Fragment>
            {isSelected && <Inspector {...props} />}
            <div {...blockProps}>
                <div className="timeline-icon">
                    <MediaUploadCheck>
                        <MediaUpload
                            onSelect={media =>
                                setAttributes({ icon: { url: media.url, id: media.id, alt: media.alt } })
                            }
                            allowedTypes={['image']}
                            value={icon?.id}
                            render={({ open }) => (
                                <button className="timeline-icon-btn" onClick={open} title={__('Change icon', 'insignia')}>
                                    {icon?.url ? (
                                        <img src={icon.url} alt={icon.alt || ''} />
                                    ) : (
                                        <DefaultIcon />
                                    )}
                                </button>
                            )}
                        />
                    </MediaUploadCheck>
                </div>
                <div {...innerBlockProps} />
            </div>
        </Fragment>
    );
};

export default Edit;
