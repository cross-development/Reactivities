import { FC, memo } from 'react';
import { useField } from 'formik';
import { Form, Label } from 'semantic-ui-react';

interface Props {
  placeholder: string;
  name: string;
  label?: string;
}

const CustomTextInput: FC<Props> = memo(props => {
  const [field, meta] = useField(props.name);

  return (
    <Form.Field error={meta.touched && !!meta.error}>
      <label>{props.label}</label>

      <input
        {...field}
        {...props}
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

CustomTextInput.displayName = 'CustomTextInput';

export default CustomTextInput;
