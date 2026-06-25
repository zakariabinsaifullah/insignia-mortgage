/**
 * Group Grid Columns — Responsive Extension
 *
 * Adds tablet and mobile column count controls to core/group blocks
 * using the grid layout variation.
 */
import { __ } from '@wordpress/i18n';
import { addFilter } from '@wordpress/hooks';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody } from '@wordpress/components';
import { createHigherOrderComponent } from '@wordpress/compose';
import { useSelect } from '@wordpress/data';

import { NativeRangeControl, NativeResponsiveControl } from '../../components';

import './style.scss';

const BLOCK_NAME = 'core/group';

/**
 * Add custom attributes for responsive grid columns.
 */
addFilter( 'blocks.registerBlockType', 'insignia/group-grid-columns/add-attributes', ( settings, name ) => {
    if ( name !== BLOCK_NAME ) {
        return settings;
    }

    return {
        ...settings,
        attributes: {
            ...settings.attributes,
            gridColumnsTablet: {
                type: 'number',
                default: undefined
            },
            gridColumnsMobile: {
                type: 'number',
                default: undefined
            }
        }
    };
} );

/**
 * Add responsive columns controls to core/group inspector when grid layout is active.
 */
addFilter(
    'editor.BlockEdit',
    'insignia/group-grid-columns/add-inspector-controls',
    createHigherOrderComponent( BlockEdit => {
        return props => {
            const { name, attributes, setAttributes, clientId } = props;

            if ( name !== BLOCK_NAME ) {
                return <BlockEdit { ...props } />;
            }

            const layoutType = attributes?.layout?.type;

            if ( layoutType !== 'grid' ) {
                return <BlockEdit { ...props } />;
            }

            const desktopColumns = attributes?.layout?.columnCount || 2;
            const tabletColumns = attributes.gridColumnsTablet ?? desktopColumns;
            const mobileColumns = attributes.gridColumnsMobile ?? 1;

            const deviceType = useSelect( select => {
                return select( 'core/editor' ).getDeviceType();
            }, [] );

            let currentColumns;
            if ( deviceType === 'Tablet' ) {
                currentColumns = tabletColumns;
            } else if ( deviceType === 'Mobile' ) {
                currentColumns = mobileColumns;
            } else {
                currentColumns = desktopColumns;
            }

            const handleChange = value => {
                if ( deviceType === 'Tablet' ) {
                    setAttributes( { gridColumnsTablet: value } );
                } else if ( deviceType === 'Mobile' ) {
                    setAttributes( { gridColumnsMobile: value } );
                }
            };

            return (
                <>
                    <BlockEdit { ...props } />
                    <InspectorControls>
                        <PanelBody title={ __( 'Responsive Grid Columns', 'insignia' ) }>
                            <NativeResponsiveControl label={ __( 'Columns', 'insignia' ) } props={ props }>
                                { deviceType === 'Desktop' ? (
                                    <div style={ { opacity: 0.5, pointerEvents: 'none' } }>
                                        <NativeRangeControl
                                            label={ __( 'Desktop Columns', 'insignia' ) }
                                            value={ desktopColumns }
                                            min={ 1 }
                                            max={ 12 }
                                            step={ 1 }
                                        />
                                    </div>
                                ) : (
                                    <NativeRangeControl
                                        label={
                                            deviceType === 'Tablet'
                                                ? __( 'Tablet Columns', 'insignia' )
                                                : __( 'Mobile Columns', 'insignia' )
                                        }
                                        value={ currentColumns }
                                        onChange={ handleChange }
                                        min={ 1 }
                                        max={ 12 }
                                        step={ 1 }
                                        resetFallbackValue={ deviceType === 'Tablet' ? desktopColumns : 1 }
                                    />
                                ) }
                            </NativeResponsiveControl>
                        </PanelBody>
                    </InspectorControls>
                </>
            );
        };
    } )
);

/**
 * Apply CSS custom properties in the editor preview for responsive grid columns.
 */
addFilter(
    'editor.BlockListBlock',
    'insignia/group-grid-columns/add-styles',
    createHigherOrderComponent( BlockListBlock => {
        return props => {
            const { name, attributes } = props;

            if ( name !== BLOCK_NAME ) {
                return <BlockListBlock { ...props } />;
            }

            const layoutType = attributes?.layout?.type;

            if ( layoutType !== 'grid' ) {
                return <BlockListBlock { ...props } />;
            }

            const desktopColumns = attributes?.layout?.columnCount || 2;
            const tabletColumns = attributes.gridColumnsTablet;
            const mobileColumns = attributes.gridColumnsMobile;

            const hasTablet = tabletColumns !== undefined;
            const hasMobile = mobileColumns !== undefined;

            if ( ! hasTablet && ! hasMobile ) {
                return <BlockListBlock { ...props } />;
            }

            const styleObj = { ...props.wrapperProps?.style };

            styleObj[ '--grid-columns-tablet' ] = hasTablet ? tabletColumns : desktopColumns;

            if ( hasMobile ) {
                styleObj[ '--grid-columns-mobile' ] = mobileColumns;
            }

            const wrapperProps = {
                ...props.wrapperProps,
                style: styleObj
            };

            const classes = [ props.className, 'has-responsive-grid-columns' ].filter( Boolean ).join( ' ' );

            return <BlockListBlock { ...props } className={ classes } wrapperProps={ wrapperProps } />;
        };
    } )
);
