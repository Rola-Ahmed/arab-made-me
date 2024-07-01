import { packingConditionsArr } from "constants/packingConditionsArr";
import { SupplyLocationArr } from "constants/SupplyLocationArr";
import { shippingConditionsArr } from "constants/shippingConditionsArr";
import { ShippingTypeSizeArr } from "constants/ShippingTypeSizeArr";
import { qualityConditionsArr } from "constants/qualityConditionsArr";

import FormVlaidtionError from "./FormVlaidtionError";
export default function SharedConditionsValidate(props) {
  let { formValidation, quantityTitle } = props;
  return (
    <>
      <div className="col-12">
        <div class="form-check w-100 d-blcok ">
          <input
            class="form-check-input"
            type="checkbox"
            id="recurrence"
            onChange={formValidation.handleChange}
            onBlur={formValidation.handleBlur}
            value={formValidation.values.recurrence}
          />
          <label class="form-check-label">Recurrence</label>
        </div>
      </div>
      {formValidation?.values?.recurrence == true && (
        <>
          {" "}
          <div className="col-md-6 col-sm-12">
            <div className="form-group">
              <label>Repeat Every *</label>

              <div className="input-group  h-100">
                <div className="input-group-prepend">
                  <select
                    className="input-group-text borders h-100 p-2 m-0"
                    id="repeats"
                    onChange={formValidation.handleChange}
                    onBlur={formValidation.handleBlur}
                    value={formValidation.values.repeats}
                  >
                    <option value="day">Day</option>
                    <option value="week">Week</option>
                    <option value="month">Month</option>
                  </select>
                </div>

                <input
                  type="text"
                  className="form-control"
                  id="every"
                  name="every"
                  placeholder="1 week"
                  onChange={formValidation.handleChange}
                  onBlur={formValidation.handleBlur}
                  value={formValidation.values.every}
                />
              </div>

              <FormVlaidtionError
                formValidation={formValidation}
                vlaidationName="every"
              />
            </div>
          </div>
          <div className="col-md-6 col-sm-12">
            <div className="form-group">
              <label> Range of recurrence (Ends on)*</label>
              <input
                type="text"
                className="form-control"
                id="endOn"
                onChange={formValidation.handleChange}
                onBlur={formValidation.handleBlur}
                value={formValidation.values.endOn}
              />

              <FormVlaidtionError
                formValidation={formValidation}
                vlaidationName="endOn"
              />
            </div>
          </div>
        </>
      )}
      <div className="col-md-6 col-sm-12">
        <div className="form-group">
          {/* quantity */}
          <label> {quantityTitle} *</label>
          <input
            type="text"
            className="form-control"
            id="quantity"
            onChange={formValidation.handleChange}
            onBlur={formValidation.handleBlur}
            value={formValidation.values.quantity}
          />
          <FormVlaidtionError
            formValidation={formValidation}
            vlaidationName="quantity"
          />
        </div>
      </div>

      <div className="col-md-6 col-sm-12">
        <div className="form-group">
          <label>Packing condition *</label>
          <select
            id="packingConditions"
            name="packingConditions"
            className="form-select form-control"
            onChange={formValidation.handleChange}
            onBlur={formValidation.handleBlur}
            value={formValidation.values.packingConditions}
          >
            <option value="">Select</option>

            {packingConditionsArr.map((item) => (
              <option value={item?.value}>{item?.name}</option>
            ))}
          </select>

          <FormVlaidtionError
            formValidation={formValidation}
            vlaidationName="packingConditions"
          />

          {formValidation.values.packingConditions == "other" ? (
            <textarea
              className="form-control w-100 "
              onChange={formValidation.handleChange}
              onBlur={formValidation.handleBlur}
              value={formValidation.values.packingConditionsOther}
              id="packingConditionsOther"
              name="packingConditionsOther"
              rows="3"
              placeholder="enter more details"
            ></textarea>
          ) : (
            ""
          )}

          <FormVlaidtionError
            formValidation={formValidation}
            vlaidationName="packingConditionsOther"
          />
        </div>
      </div>

      <div className="col-md-6 col-sm-12">
        <div className="form-group">
          <label>Supply Location *</label>
          <select
            id="SupplyLocation"
            className="form-select form-control"
            onChange={formValidation.handleChange}
            onBlur={formValidation.handleBlur}
            value={formValidation.values.SupplyLocation}
          >
            {SupplyLocationArr.map((item) => (
              <option value={item?.value}>{item?.name}</option>
            ))}
          </select>

          <FormVlaidtionError
            formValidation={formValidation}
            vlaidationName="SupplyLocation"
          />
        </div>
      </div>

      <div className="col-md-6 col-sm-12">
        <div className="form-group">
          <label>shipping conditions *</label>
          <select
            id="shippingConditions"
            className="form-select form-control"
            onChange={formValidation.handleChange}
            onBlur={formValidation.handleBlur}
            value={formValidation.values.shippingConditions}
          >
            {/* <option value="">select</option> */}

            {shippingConditionsArr.map((item) => (
              <option value={item?.value}>{item?.name}</option>
            ))}
            <option value="other">Other</option>
          </select>

          <FormVlaidtionError
            formValidation={formValidation}
            vlaidationName="shippingConditions"
          />

          {formValidation.values.shippingConditions == "other" ? (
            <textarea
              className="form-control w-100 "
              onChange={formValidation.handleChange}
              onBlur={formValidation.handleBlur}
              value={formValidation.values.shippingConditionsOther}
              id="shippingConditionsOther"
              name="shippingConditionsOther"
              rows="3"
              placeholder="enter more details"
            ></textarea>
          ) : (
            ""
          )}

          <FormVlaidtionError
            formValidation={formValidation}
            vlaidationName="shippingConditionsOther"
          />
        </div>
      </div>

      <div className="col-md-6 col-sm-12">
        <div className="form-group">
          <label>Shipping Type and Size * </label>
          <select
            id="ShippingTypeSize"
            className="form-select form-control"
            onChange={formValidation.handleChange}
            onBlur={formValidation.handleBlur}
            value={formValidation.values.ShippingTypeSize}
          >
            <option value="">select</option>

            {ShippingTypeSizeArr?.map((item) => (
              <optgroup label={item?.name}>
                {item?.subValues.map((options) => (
                  <option value={options}>{options}</option>
                ))}
              </optgroup>
            ))}
            <option value="other">Other</option>
          </select>

          <FormVlaidtionError
            formValidation={formValidation}
            vlaidationName="ShippingTypeSize"
          />

          {formValidation.values.ShippingTypeSize == "other" ? (
            <textarea
              className="form-control w-100 "
              onChange={formValidation.handleChange}
              onBlur={formValidation.handleBlur}
              value={formValidation.values.ShippingTypeSizeOther}
              id="ShippingTypeSizeOther"
              name="ShippingTypeSizeOther"
              rows="3"
              placeholder="enter more details"
            ></textarea>
          ) : (
            ""
          )}

          <FormVlaidtionError
            formValidation={formValidation}
            vlaidationName="ShippingTypeSizeOther"
          />
        </div>
      </div>

      <div className="col-md-6 col-sm-12">
        <div className="form-group">
          <label>Quality Conditions *</label>
          <select
            className="form-select form-control"
            id="qualityConditions"
            onChange={formValidation.handleChange}
            onBlur={formValidation.handleBlur}
            value={formValidation.values.qualityConditions}
          >
            {qualityConditionsArr.map((item) => (
              <option value={item?.value}>{item?.name}</option>
            ))}
          </select>

          <FormVlaidtionError
            formValidation={formValidation}
            vlaidationName="qualityConditions"
          />
          {formValidation.values.qualityConditions == "other" ? (
            <textarea
              className="form-control w-100 "
              onChange={formValidation.handleChange}
              onBlur={formValidation.handleBlur}
              value={formValidation.values.qualityConditionsOther}
              id="qualityConditionsOther"
              name="qualityConditionsOther"
              rows="3"
              placeholder="enter more details"
            ></textarea>
          ) : (
            ""
          )}

          <FormVlaidtionError
            formValidation={formValidation}
            vlaidationName="qualityConditionsOther"
          />
        </div>
      </div>

      <div className="col-12">
        <div className="form-group">
          <label>Other Conditions</label>
          <textarea
            className="form-control w-100 "
            onChange={formValidation.handleChange}
            onBlur={formValidation.handleBlur}
            value={formValidation.values.otherConditions}
            id="otherConditions"
            rows="3"
            placeholder="enter more details"
          ></textarea>
          <FormVlaidtionError
            formValidation={formValidation}
            vlaidationName="otherConditions"
          />
        </div>
      </div>
    </>
  );
}
