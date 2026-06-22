import { __ } from '@wordpress/i18n';
import { useBlockProps, useInnerBlocksProps, RichText } from '@wordpress/block-editor';
import { useEffect } from '@wordpress/element';
import './editor.scss';
import Inspector from './inspector';

const TEMPLATE = [['core/paragraph', { placeholder: __('Add your content here...', 'insignia') }]];

const Edit = props => {
    const { attributes, setAttributes, isSelected } = props;
    const { badgeText, footerNote, badgeColor, badgeBgColor, borderColor, badgeFontSize, footerColor, footerFontSize } = attributes;

    const cssCustomProperties = {
        ...(badgeColor && { '--frame-badge-color': badgeColor }),
        ...(badgeBgColor && { '--frame-badge-bg': badgeBgColor }),
        ...(borderColor && { '--frame-border-color': borderColor }),
        ...(badgeFontSize && { '--frame-badge-size': `${badgeFontSize}px` }),
        ...(footerColor && { '--frame-footer-color': footerColor }),
        ...(footerFontSize && { '--frame-footer-size': `${footerFontSize}px` })
    };

    useEffect(() => {
        setAttributes({ blockStyle: cssCustomProperties });
    }, [badgeColor, badgeBgColor, borderColor, badgeFontSize, footerColor, footerFontSize]);

    const blockProps = useBlockProps({
        style: cssCustomProperties,
        className: 'insignia-frame'
    });

    const innerBlocksProps = useInnerBlocksProps(
        { className: 'insignia-frame__inner' },
        {
            template: TEMPLATE,
            templateLock: false
        }
    );

    return (
        <>
            {isSelected && <Inspector {...props} />}
            <div {...blockProps}>
                <div className="insignia-frame__badge">
                    <RichText
                        tagName="span"
                        value={badgeText}
                        onChange={value => setAttributes({ badgeText: value })}
                        placeholder={__('Badge Label', 'insignia')}
                    />
                </div>
                <div {...innerBlocksProps} />
                <div className="insignia-frame__footer">
                    <RichText
                        tagName="span"
                        value={footerNote}
                        onChange={value => setAttributes({ footerNote: value })}
                        placeholder={__('Footer note...', 'insignia')}
                    />
                </div>
            </div>
        </>
    );
};

export default Edit;
