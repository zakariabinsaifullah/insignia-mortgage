import { useBlockProps, useInnerBlocksProps, MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { Fragment, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import Inspector from './inspector';

const INNER_TEMPLATE = [['core/paragraph', { placeholder: 'Add content here…' }]];

const Edit = props => {
    const { attributes, setAttributes, isSelected } = props;
    const { icon, iconBgColor } = attributes;

    const cssCustomProperties = {
        ...(iconBgColor && { '--icon-bg': iconBgColor })
    };

    const blockProps = useBlockProps({
        style: cssCustomProperties
    });

    useEffect(() => {
        setAttributes({ blockStyle: cssCustomProperties });
    }, [ iconBgColor]);

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
                                    {icon?.url && (
                                        <img src={icon.url} alt={icon.alt || ''} />
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
