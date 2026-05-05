import { __ } from '@wordpress/i18n';
import { NativeToggleControl, NativeUnitControl, ColorControlDropdown } from '../../../components';

const UNITS = [
    { label: 'px',  value: 'px'  },
    { label: '%',   value: '%'   },
    { label: 'em',  value: 'em'  },
    { label: 'rem', value: 'rem' },
    { label: 'vh',  value: 'vh'  },
    { label: 'vw',  value: 'vw'  },
];

const BorderSettings = ({ prefix, toggleLabel, attributes, setAttributes }) => {
    const enabled = !! attributes[ `${ prefix }Enabled` ];
    const update  = ( key, value ) => setAttributes({ [ `${ prefix }${ key }` ]: value });

    return (
        <>
            <NativeToggleControl
                label={ toggleLabel }
                checked={ enabled }
                onChange={ val => update( 'Enabled', val ) }
            />
            { enabled && (
                <>
                    <NativeUnitControl
                        label={ __( 'Width', 'insignia' ) }
                        value={ attributes[ `${ prefix }Width` ] || '' }
                        onChange={ val => update( 'Width', val ) }
                        units={ UNITS }
                        mb="16px"
                    />
                    <NativeUnitControl
                        label={ __( 'Height', 'insignia' ) }
                        value={ attributes[ `${ prefix }Height` ] || '' }
                        onChange={ val => update( 'Height', val ) }
                        units={ UNITS }
                    />
                    <div style={{ "margin": '16px 0' }}>
                        <ColorControlDropdown
                            label={ __( 'Color', 'insignia' ) }
                            colorValue={{ default: attributes[ `${ prefix }Color` ] || '' }}
                            onChangeColor={ val => update( 'Color', val.default || '' ) }
                        />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                        <NativeUnitControl
                            label={ __( 'Top', 'insignia' ) }
                            value={ attributes[ `${ prefix }Top` ] || '' }
                            onChange={ val => update( 'Top', val ) }
                            units={ UNITS }
                            labelPosition="top"
                        />
                        <NativeUnitControl
                            label={ __( 'Right', 'insignia' ) }
                            value={ attributes[ `${ prefix }Right` ] || '' }
                            onChange={ val => update( 'Right', val ) }
                            units={ UNITS }
                            labelPosition="top"
                        />
                        <NativeUnitControl
                            label={ __( 'Bottom', 'insignia' ) }
                            value={ attributes[ `${ prefix }Bottom` ] || '' }
                            onChange={ val => update( 'Bottom', val ) }
                            units={ UNITS }
                            labelPosition="top"
                        />
                        <NativeUnitControl
                            label={ __( 'Left', 'insignia' ) }
                            value={ attributes[ `${ prefix }Left` ] || '' }
                            onChange={ val => update( 'Left', val ) }
                            units={ UNITS }
                            labelPosition="top"
                        />
                    </div>
                </>
            ) }
        </>
    );
};

export default BorderSettings;
