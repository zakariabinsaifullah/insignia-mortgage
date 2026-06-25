/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

import {
    RichText,
    BlockControls,
    InspectorControls,
    useBlockProps,
    JustifyToolbar,
    __experimentalUseBorderProps as useBorderProps,
    __experimentalUseColorProps as useColorProps,
    __experimentalGetSpacingClassesAndStyles as useSpacingProps,
    __experimentalGetShadowClassesAndStyles as useShadowProps,
    __experimentalLinkControl as LinkControl
} from '@wordpress/block-editor';
import { link } from '@wordpress/icons';
import {
    PanelBody,
    RangeControl,
    ToolbarButton,
    Popover,
    __experimentalToolsPanel as ToolsPanel, // eslint-disable-line
    __experimentalToolsPanelItem as ToolsPanelItem
} from '@wordpress/components';
import { useState, useEffect } from '@wordpress/element';
import { useSelect } from '@wordpress/data';

import classNames from 'classnames';

/**
 * Internal dependencies
 */
import {
    NativeResponsiveControl,
    NativeToggleControl,
    NativeTextControl,
    NativeIconPicker,
    PanelColorControl,
    NativeSelectControl,
    NativeUnitControl
} from '../../components';

import { RenderIcon } from '../../helpers';

import './editor.scss';

export default function Edit( props ) {
    const { attributes, setAttributes, className } = props;
    const {
        iconName,
        iconSize,
        customSvgCode,
        iconType,
        strokeWidth,
        justifyContent,
        href,
        linkTarget,
        sizes,
        resMode,
        heading,
        headingTag,
        showTitle,
        listGap,
        titleColor,
        titleSize,
        titleFontFamily
    } = attributes;

    const fontFamilies = useSelect( select => {
        const settings = select( 'core/block-editor' ).getSettings();
        const typography = settings?.typography || settings?.__experimentalFeatures?.typography;
        const fontFamiliesSetting = typography?.fontFamilies;

        if ( ! fontFamiliesSetting ) {
            return [];
        }

        const families = [];
        if ( Array.isArray( fontFamiliesSetting ) ) {
            families.push( ...fontFamiliesSetting );
        } else {
            const { theme = [], custom = [], default: defaultFonts = [] } = fontFamiliesSetting;
            families.push( ...theme, ...custom, ...defaultFonts );
        }

        return families;
    }, [] );

    const fontFamilyOptions = [
        { label: __( 'Default', 'insignia' ), value: '' },
        ...fontFamilies.map( f => {
            const value = f.fontFamily || ( f.slug ? `var(--wp--preset--font-family--${ f.slug })` : f.slug );
            return {
                label: f.name || f.slug || __( 'Unknown', 'insignia' ),
                value
            };
        } )
    ];

    const cssCustomProperties = {
        ...( listGap && { '--list-gap': `${ listGap }` } ),
        ...( titleColor && { '--title-color': titleColor } ),
        ...( titleSize && { '--title-size': `${ titleSize }` } ),
        ...( titleFontFamily && { '--title-font-family': titleFontFamily } )
    };

    useEffect( () => {
        setAttributes( {
            blockStyle: cssCustomProperties
        } );
    }, [ listGap, titleColor, titleSize, titleFontFamily ] );

    // states
    const [ isEditingURL, setIsEditingURL ] = useState( false );
    const [ popoverAnchor, setPopoverAnchor ] = useState( null );

    const borderProps = useBorderProps( attributes );
    const colorProps = useColorProps( attributes );
    const spacingProps = useSpacingProps( attributes );
    const shadowProps = useShadowProps( attributes );

    const blockProps = useBlockProps( {
        style: cssCustomProperties,
        className: classNames( className, {
            [ `is-${ iconType }` ]: iconType,
            [ `justify-${ justifyContent }` ]: justifyContent
        } )
    } );

    return (
        <>
            <BlockControls group="block">
                <JustifyToolbar
                    allowedControls={ [ 'left', 'center', 'right' ] }
                    value={ justifyContent }
                    onChange={ value =>
                        setAttributes( {
                            justifyContent: value
                        } )
                    }
                />
                <ToolbarButton
                    ref={ setPopoverAnchor }
                    name="link"
                    icon={ link }
                    title={ __( 'Link', 'insignia' ) }
                    onClick={ () => setIsEditingURL( true ) }
                    isActive={ !! href || isEditingURL }
                />
                { isEditingURL && (
                    <Popover
                        anchor={ popoverAnchor }
                        onClose={ () => setIsEditingURL( false ) }
                        placement="bottom"
                        focusOnMount={ true }
                        offset={ 12 }
                        className="insignia-icon__link-popover"
                        variant="alternate"
                    >
                        <LinkControl
                            value={ {
                                url: href,
                                opensInNewTab: linkTarget === '_blank'
                            } }
                            onChange={ ( { url: newURL = '', opensInNewTab } ) => {
                                setAttributes( {
                                    href: newURL,
                                    linkTarget: opensInNewTab ? '_blank' : undefined,
                                    linkRel: newURL ? 'nofollow' : undefined,
                                    tagName: 'a'
                                } );
                            } }
                            onRemove={ () =>
                                setAttributes( {
                                    href: undefined,
                                    linkTarget: undefined,
                                    linkRel: undefined,
                                    tagName: 'div'
                                } )
                            }
                        />
                    </Popover>
                ) }
            </BlockControls>
            <InspectorControls>
                <PanelBody title={ __( 'Settings', 'insignia' ) }>
                    <NativeToggleControl
                        label={ __( 'Add List Title', 'insignia' ) }
                        checked={ showTitle }
                        onChange={ value => setAttributes( { showTitle: value } ) }
                    />
                    <NativeIconPicker
                        onIconSelect={ ( iconName, iconType ) => {
                            setAttributes( { iconName, iconType, customSvgCode: undefined } );
                        } }
                        onCustomSvgInsert={ ( { customSvgCode, iconType, strokeWidth } ) => {
                            setAttributes( { customSvgCode, iconType, strokeWidth } );
                        } }
                        iconName={ iconName }
                        customSvgCode={ customSvgCode }
                        iconSize={ iconSize }
                        strokeWidth={ strokeWidth }
                    />
                    <NativeResponsiveControl label={ __( 'Icon Size (px)', 'insignia' ) } props={ props }>
                        <RangeControl
                            value={ sizes[ resMode ] }
                            onChange={ value => setAttributes( { sizes: { ...sizes, [ resMode ]: value } } ) }
                            min={ 8 }
                            max={ 256 }
                            __next40pxDefaultSize
                        />
                    </NativeResponsiveControl>
                </PanelBody>
                { showTitle && (
                    <PanelBody title={ __( 'List Title', 'insignia' ) } initialOpen={ false }>
                        <NativeUnitControl
                            label={ __( 'Gap', 'insignia' ) }
                            value={ listGap }
                            onChange={ value => setAttributes( { listGap: value } ) }
                        />
                        { showTitle && (
                            <>
                                <NativeSelectControl
                                    label={ __( 'Select Tag', 'insignia' ) }
                                    value={ headingTag }
                                    onChange={ value => setAttributes( { headingTag: value } ) }
                                    options={ [
                                        { label: __( 'H1', 'insignia' ), value: 'h1' },
                                        { label: __( 'H2', 'insignia' ), value: 'h2' },
                                        { label: __( 'H3', 'insignia' ), value: 'h3' },
                                        { label: __( 'H4', 'insignia' ), value: 'h4' },
                                        { label: __( 'H5', 'insignia' ), value: 'h5' },
                                        { label: __( 'H6', 'insignia' ), value: 'h6' },
                                        { label: __( 'Paragraph', 'insignia' ), value: 'p' },
                                        { label: __( 'Div', 'insignia' ), value: 'div' }
                                    ] }
                                />
                                <NativeTextControl
                                    label={ __( 'Title Text', 'insignia' ) }
                                    value={ heading }
                                    onChange={ value => setAttributes( { heading: value } ) }
                                    placeholder={ __( 'List title…', 'insignia' ) }
                                />
                            </>
                        ) }
                    </PanelBody>
                ) }
            </InspectorControls>
            <InspectorControls group="styles">
                { showTitle && (
                    <ToolsPanel
                        label={ __( 'Title', 'insignia' ) }
                        resetAll={ () =>
                            setAttributes( {
                                titleSize: undefined,
                                titleColor: undefined
                            } )
                        }
                    >
                        <ToolsPanelItem
                            hasValue={ () => !! titleSize }
                            label={ __( 'Size', 'insignia' ) }
                            onDeselect={ () => {
                                setAttributes( {
                                    titleSize: undefined
                                } );
                            } }
                            onSelect={ () => {} }
                        >
                            <NativeUnitControl
                                label={ __( 'Font Size', 'insignia' ) }
                                value={ titleSize }
                                onChange={ value => setAttributes( { titleSize: value } ) }
                            />
                        </ToolsPanelItem>

                        <ToolsPanelItem
                            hasValue={ () => !! titleColor }
                            label={ __( 'Color', 'insignia' ) }
                            onDeselect={ () => {
                                setAttributes( {
                                    titleColor: undefined
                                } );
                            } }
                            onSelect={ () => {} }
                        >
                            <PanelColorControl
                                label={ __( 'Color', 'insignia' ) }
                                colorSettings={ [
                                    {
                                        value: titleColor,
                                        onChange: color => setAttributes( { titleColor: color } ),
                                        label: __( 'Color', 'insignia' )
                                    }
                                ] }
                            />
                        </ToolsPanelItem>

                        <ToolsPanelItem
                            hasValue={ () => !! titleFontFamily }
                            label={ __( 'Font', 'insignia' ) }
                            onDeselect={ () => {
                                setAttributes( {
                                    titleFontFamily: undefined
                                } );
                            } }
                            onSelect={ () => {} }
                        >
                            <NativeSelectControl
                                label={ __( 'Font', 'insignia' ) }
                                value={ titleFontFamily }
                                onChange={ value => setAttributes( { titleFontFamily: value } ) }
                                options={ fontFamilyOptions }
                            />
                        </ToolsPanelItem>
                    </ToolsPanel>
                ) }
            </InspectorControls>
            <div { ...blockProps }>
                <div className="insignia-icon-block-wrapper">
                    <div
                        className={ classNames( 'icon-container', colorProps.className, borderProps.className ) }
                        style={ {
                            ...borderProps.style,
                            ...colorProps.style,
                            ...spacingProps.style,
                            ...shadowProps.style,
                            ...( sizes?.Desktop !== 60 && { '--dsize': `${ sizes.Desktop }px` } ),
                            ...( sizes?.Tablet !== 48 && { '--tsize': `${ sizes.Tablet }px` } ),
                            ...( sizes?.Mobile !== 32 && { '--msize': `${ sizes.Mobile }px` } )
                        } }
                    >
                        <RenderIcon customSvgCode={ customSvgCode } iconName={ iconName } size={ iconSize } />
                    </div>
                    { showTitle && (
                        <div className="icon-content">
                            <RichText
                                tagName={ headingTag }
                                value={ heading }
                                onChange={ value => setAttributes( { heading: value } ) }
                                placeholder={ __( 'List title…', 'insignia' ) }
                                className="icon-heading"
                            />
                        </div>
                    ) }
                </div>
            </div>
        </>
    );
}
