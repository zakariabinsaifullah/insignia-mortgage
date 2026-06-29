import { __ } from '@wordpress/i18n';
import { InspectorControls, MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { PanelBody, Button, TextControl, ToggleControl, TextareaControl } from '@wordpress/components';

const Inspector = props => {
    const { attributes, setAttributes } = props;
    const { image, buttonText, buttonUrl, buttonNewTab, overlayGraident } = attributes;

    return (
        <>
            <InspectorControls group="settings">
                <PanelBody title={ __( 'Image', 'insignia' ) } initialOpen={ true }>
                    <MediaUploadCheck>
                        <MediaUpload
                            onSelect={ media =>
                                setAttributes( {
                                    image: {
                                        id: media.id,
                                        url: media.url,
                                        alt: media.alt
                                    }
                                } )
                            }
                            allowedTypes={ [ 'image' ] }
                            value={ image?.id }
                            render={ ( { open } ) => (
                                <div>
                                    { image?.url && (
                                        <img
                                            src={ image.url }
                                            alt={ image.alt || '' }
                                            style={ { width: '100%', marginBottom: '8px', borderRadius: '4px' } }
                                        />
                                    ) }
                                    <Button
                                        variant={ image?.url ? 'secondary' : 'primary' }
                                        onClick={ open }
                                        style={ { width: '100%', justifyContent: 'center' } }
                                    >
                                        { image?.url ? __( 'Replace Image', 'insignia' ) : __( 'Select Image', 'insignia' ) }
                                    </Button>
                                    { image?.url && (
                                        <Button
                                            isDestructive
                                            onClick={ () => setAttributes( { image: {} } ) }
                                            style={ { width: '100%', justifyContent: 'center', marginTop: '4px' } }
                                        >
                                            { __( 'Remove Image', 'insignia' ) }
                                        </Button>
                                    ) }
                                </div>
                            ) }
                        />
                    </MediaUploadCheck>
                        <TextareaControl
                            label={__('Overlay Gradiant', 'insignia')}
                            value={ overlayGraident }
                            onChange={ ( v ) => setAttributes( { overlayGraident: v } ) }
                            placeholder='linear-gradient(180deg, transparent 45%, rgba(18, 100, 100, 0.85) 75%, #126464 100%)'
                        />
                </PanelBody>
                <PanelBody title={ __( 'Button', 'insignia' ) } initialOpen={ true }>
                    <TextControl
                        label={ __( 'Button Text', 'insignia' ) }
                        value={ buttonText || '' }
                        onChange={ value => setAttributes( { buttonText: value } ) }
                        placeholder={ __( 'Learn More', 'insignia' ) }
                    />
                    <TextControl
                        label={ __( 'Button URL', 'insignia' ) }
                        value={ buttonUrl || '' }
                        onChange={ value => setAttributes( { buttonUrl: value } ) }
                        placeholder="https://"
                        type="url"
                    />
                    <ToggleControl
                        label={ __( 'Open in new tab', 'insignia' ) }
                        checked={ buttonNewTab }
                        onChange={ value => setAttributes( { buttonNewTab: value } ) }
                    />
                </PanelBody>
            </InspectorControls>
        </>
    );
};

export default Inspector;
