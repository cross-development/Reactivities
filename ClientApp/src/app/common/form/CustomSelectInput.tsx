import { FC, memo } from 'react';
import { useField } from 'formik';
import { DropdownItemProps, Form, Label, Select } from 'semantic-ui-react';

interface Props {
  placeholder: string;
  name: string;
  label?: string;
  options: DropdownItemProps[];
}

const CustomSelectInput: FC<Props> = memo(props => {
  const [field, meta, helpers] = useField(props.name);

  return (
    <Form.Field error={meta.touched && !!meta.error}>
      <label>{props.label}</label>

      <Select
        clearable
        options={props.options}
        value={field.value || null}
        placeholder={props.placeholder}
        onChange={(_, data) => helpers.setValue(data.value)}
        onBlur={() => helpers.setTouched(true)}
      />

      {meta.touched && meta.error ? (
        <Label
          basic
          color="red"
        >
          {meta.error}
        </Label>
      ) : null}
    </Form.Field>
  );
});

CustomSelectInput.displayName = 'CustomSelectInput';

export default CustomSelectInput;
