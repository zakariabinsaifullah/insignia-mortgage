import { __ } from '@wordpress/i18n';
import { InspectorControls, MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { PanelBody, Button } from '@wordpress/components';
import { PanelColorControl } from '../../components';

const Inspector = props => {
    const { attributes, setAttributes } = props;
    const { icon, iconBgColor } = attributes;

    return (
        <>
            <InspectorControls group="settings">
                <PanelBody title={__('Icon Image', 'insignia')} initialOpen={false}>
                    <MediaUploadCheck>
                        <MediaUpload
                            onSelect={media =>
                                setAttributes({ icon: { url: media.url, id: media.id, alt: media.alt } })
                            }
                            allowedTypes={['image']}
                            value={icon?.id}
                            render={({ open }) => (
                                <div>
                                    {icon?.url && (
                                        <img
                                            src={icon.url}
                                            alt={icon.alt || ''}
                                            style={{ width: '48px', height: '48px', objectFit: 'contain', marginBottom: '8px', display: 'block' }}
                                        />
                                    )}
                                    <Button variant="secondary" onClick={open}>
                                        {icon?.url ? __('Change Icon', 'insignia') : __('Upload Icon', 'insignia')}
                                    </Button>
                                    {icon?.url && (
                                        <Button
                                            variant="link"
                                            isDestructive
                                            onClick={() => setAttributes({ icon: {} })}
                                            style={{ marginLeft: '8px' }}
                                        >
                                            {__('Remove', 'insignia')}
                                        </Button>
                                    )}
                                </div>
                            )}
                        />
                    </MediaUploadCheck>
                </PanelBody>
            </InspectorControls>
            <InspectorControls group="styles">
                <PanelBody title={__('Icon Circle', 'insignia')} initialOpen={true}>
                    <PanelColorControl
                        label={__('Circle Background', 'insignia')}
                        colorSettings={[
                            {
                                value: iconBgColor,
                                onChange: color => setAttributes({ iconBgColor: color }),
                                label: __('Background', 'insignia')
                            }
                        ]}
                    />
                </PanelBody>
            </InspectorControls>
        </>
    );
};

export default Inspector;
