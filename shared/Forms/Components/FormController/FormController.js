import React, { PropTypes } from 'react';

export const FormController = ({ name, children, handleSubmit, showSubmit, submitSucceeded, submitting, customSubmitting, pristine, invalid, submitValue, btnWrapperClasses='col-xs-12 col-sm-12', customSuccess, customError }) => (
    <form className={`form ${name}-form`} onSubmit={handleSubmit} autoComplete="false">
        {children}

        { showSubmit && (!submitSucceeded && !submitting) ?
            <div className={btnWrapperClasses}>
                <button className="btn form-submit" type="submit" disabled={(pristine || invalid) || submitting || customSubmitting} >
                    {submitValue}
                </button>
            </div>
        : null}

        <div className="col-md-12 error">
            { customError ? <p><i className="glyphicon glyphicon-warning-sign"> </i>{customError}</p> : null }
        </div>

        <div className="col-md-12 success">
            { customSuccess ? <p><i className="glyphicon glyphicon-ok"> </i>{customSuccess}</p> : null }
        </div>
    </form>
);

FormController.propTypes = {
    name: PropTypes.string.required,
    children: PropTypes.node,
    handleSubmit: PropTypes.func,
    submitSucceeded: PropTypes.bool,
    submitting: PropTypes.bool,
    customSubmitting: PropTypes.bool,
    pristine: PropTypes.bool,
    invalid: PropTypes.bool,
    customSuccess: PropTypes.string,
    customError: PropTypes.string,
    submitValue: PropTypes.node,
    showSubmit: PropTypes.bool
};

export default FormController;