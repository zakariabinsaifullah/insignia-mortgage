/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { addFilter } from '@wordpress/hooks';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody } from '@wordpress/components';
import { createHigherOrderComponent } from '@wordpress/compose';

/**
 * Internal dependencies
 */
import { NativeToggleGroupControl, NativeRangeControl } from '../../components';

const BLOCK_NAME = 'core/heading';
const STYLE_CLASS = 'is-style-arrow';

const isArrowHeading = attributes => !! attributes.className?.includes( STYLE_CLASS );

/**
 * Add arrowAlign and arrowSize attributes to core/heading.
 */
addFilter( 'blocks.registerBlockType', 'insignia/heading-arrow-add-attributes', ( settings, name ) => {
    if ( name !== BLOCK_NAME ) {
        return settings;
    }

    return {
        ...settings,
        attributes: {
            ...settings.attributes,
            arrowAlign: { type: 'string', default: 'left' },
            arrowSize: { type: 'number', default: 35 }
        }
    };
} );

/**
 * Add Arrow Settings panel to the inspector when the arrow style is active.
 */
addFilter(
    'editor.BlockEdit',
    'insignia/heading-arrow-add-controls',
    createHigherOrderComponent( BlockEdit => props => {
        if ( props.name !== BLOCK_NAME || ! isArrowHeading( props.attributes ) ) {
            return <BlockEdit { ...props } />;
        }

        const { arrowAlign, arrowSize } = props.attributes;

        return (
            <>
                <BlockEdit { ...props } />
                <InspectorControls>
                    <PanelBody title={ __( 'Arrow Settings', 'insignia' ) } initialOpen>
                        <NativeToggleGroupControl
                            label={ __( 'Alignment', 'insignia' ) }
                            value={ arrowAlign }
                            onChange={ v => props.setAttributes( { arrowAlign: v } ) }
                            options={ [
                                { label: __( 'Left', 'insignia' ), value: 'left' },
                                { label: __( 'Center', 'insignia' ), value: 'center' }
                            ] }
                        />
                        <NativeRangeControl
                            label={ __( 'Size', 'insignia' ) }
                            value={ arrowSize }
                            onChange={ v => props.setAttributes( { arrowSize: v } ) }
                            min={ 20 }
                            max={ 80 }
                            step={ 1 }
                            resetFallbackValue={ 35 }
                        />
                    </PanelBody>
                </InspectorControls>
            </>
        );
    } )
);

/**
 * Apply CSS custom properties in the editor preview via wrapperProps.
 * CSS vars cascade into the heading's ::before pseudo-element.
 */
addFilter(
    'editor.BlockListBlock',
    'insignia/heading-arrow-add-styles',
    createHigherOrderComponent( BlockListBlock => props => {
        if ( props.name !== BLOCK_NAME || ! isArrowHeading( props.attributes ) ) {
            return <BlockListBlock { ...props } />;
        }

        const { arrowAlign = 'left', arrowSize = 35 } = props.attributes;
        const isCenter = arrowAlign === 'center';

        const wrapperProps = {
            ...props.wrapperProps,
            style: {
                ...props.wrapperProps?.style,
                '--arrow-size': arrowSize + 'px',
                '--arrow-align-x': isCenter ? '50%' : '0',
                '--arrow-align-transform': isCenter ? 'translateX(-50%)' : 'none'
            }
        };

        return <BlockListBlock { ...props } wrapperProps={ wrapperProps } />;
    } )
);
