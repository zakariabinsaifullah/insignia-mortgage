import { __ } from '@wordpress/i18n';
import { InspectorControls, MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { PanelBody, Button } from '@wordpress/components';

const Inspector = props => {
    const { attributes, setAttributes } = props;
    const { image } = attributes;

    return (
        <>
            <InspectorControls group="settings">
                <PanelBody title={__('Image', 'insignia')} initialOpen={true}>
                    <MediaUploadCheck>
                        <MediaUpload
                            onSelect={media =>
                                setAttributes({
                                    image: {
                                        id: media.id,
                                        url: media.url,
                                        alt: media.alt
                                    }
                                })
                            }
                            allowedTypes={['image']}
                            value={image?.id}
                            render={({ open }) => (
                                <div>
                                    {image?.url && (
                                        <img
                                            src={image.url}
                                            alt={image.alt || ''}
                                            style={{ width: '100%', marginBottom: '8px', borderRadius: '4px' }}
                                        />
                                    )}
                                    <Button
                                        variant={image?.url ? 'secondary' : 'primary'}
                                        onClick={open}
                                        style={{ width: '100%', justifyContent: 'center' }}
                                    >
                                        {image?.url
                                            ? __('Replace Image', 'insignia')
                                            : __('Select Image', 'insignia')}
                                    </Button>
                                    {image?.url && (
                                        <Button
                                            isDestructive
                                            onClick={() => setAttributes({ image: {} })}
                                            style={{ width: '100%', justifyContent: 'center', marginTop: '4px' }}
                                        >
                                            {__('Remove Image', 'insignia')}
                                        </Button>
                                    )}
                                </div>
                            )}
                        />
                    </MediaUploadCheck>
                </PanelBody>
            </InspectorControls>
        </>
    );
};

export default Inspector;
