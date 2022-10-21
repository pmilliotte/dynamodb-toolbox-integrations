"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyAttributeProperties = void 0;
const constants_1 = require("./constants");
const TYPE_MAPPING = {
    string: "S",
    number: "N",
    boolean: "Bool",
    map: "M",
};
exports.applyAttributeProperties = (entity) => {
    const { attributes } = entity.schema;
    const nullValue = entity.table.removeNullAttributes
        ? null
        : {
            NULL: true,
        };
    const params = Object.entries(entity.attributes).reduce((tempParams, [attributeKey, { type, prefix, suffix }]) => {
        var _a, _b;
        const attributeMap = (_a = attributes[attributeKey].map) !== null && _a !== void 0 ? _a : attributeKey;
        const attributeAlias = (_b = attributes[attributeKey].alias) !== null && _b !== void 0 ? _b : attributeKey;
        if (constants_1.DYNAMODB_TOOLBOX_GENERATED_ATTRIBUTE_ALIASES.includes(attributeAlias)) {
            return {
                ...tempParams,
                [attributeMap]: {
                    value: [{ "S.$": `$$.State.EnteredTime` }],
                    isPlaceholder: false,
                    // Won't be selected anyway
                    nullValue: [null],
                    attributeMap,
                    isNull: false,
                },
            };
        }
        const key = `${TYPE_MAPPING[type]}.$`;
        const value = {
            [key]: `States.Format('${prefix !== null && prefix !== void 0 ? prefix : ""}{}${suffix !== null && suffix !== void 0 ? suffix : ""}', $.data.${attributeMap}[0])`,
        };
        return {
            ...tempParams,
            [attributeMap]: {
                value: [value],
                "isPlaceholder.$": `States.ArrayContains($.data['${attributeMap}'], $.uuid)`,
                "isNull.$": `States.ArrayContains($.data['${attributeMap}'], null)`,
                // Need to set it as array to be able to get null value if removeNullAttributes is true, because Dynamodb does not support Null properties set to false
                nullValue: [null],
                null2Value: [nullValue],
                attributeMap,
            },
        };
    }, {});
    return params;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwbHlBdHRyaWJ1dGVQcm9wZXJ0aWVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYXBwbHlBdHRyaWJ1dGVQcm9wZXJ0aWVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLDJDQUdxQjtBQUVyQixNQUFNLFlBQVksR0FBMkI7SUFDM0MsTUFBTSxFQUFFLEdBQUc7SUFDWCxNQUFNLEVBQUUsR0FBRztJQUNYLE9BQU8sRUFBRSxNQUFNO0lBQ2YsR0FBRyxFQUFFLEdBQUc7Q0FDVCxDQUFDO0FBRVcsUUFBQSx3QkFBd0IsR0FBRyxDQUN0QyxNQUFjLEVBQ1csRUFBRTtJQUMzQixNQUFNLEVBQUUsVUFBVSxFQUFFLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQztJQUVyQyxNQUFNLFNBQVMsR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLG9CQUFvQjtRQUNqRCxDQUFDLENBQUMsSUFBSTtRQUNOLENBQUMsQ0FBQztZQUNFLElBQUksRUFBRSxJQUFJO1NBQ1gsQ0FBQztJQUVOLE1BQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQzNCLE1BQU0sQ0FBQyxVQUdOLENBQ0YsQ0FBQyxNQUFNLENBQUMsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxZQUFZLEVBQUUsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTs7UUFDaEUsTUFBTSxZQUFZLFNBQUcsVUFBVSxDQUFDLFlBQVksQ0FBQyxDQUFDLEdBQUcsbUNBQUksWUFBWSxDQUFDO1FBQ2xFLE1BQU0sY0FBYyxTQUFHLFVBQVUsQ0FBQyxZQUFZLENBQUMsQ0FBQyxLQUFLLG1DQUFJLFlBQVksQ0FBQztRQUV0RSxJQUFJLHdEQUE0QyxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsRUFBRTtZQUN6RSxPQUFPO2dCQUNMLEdBQUcsVUFBVTtnQkFDYixDQUFDLFlBQVksQ0FBQyxFQUFFO29CQUNkLEtBQUssRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFLHNCQUFzQixFQUFFLENBQUM7b0JBQzFDLGFBQWEsRUFBRSxLQUFLO29CQUNwQiwyQkFBMkI7b0JBQzNCLFNBQVMsRUFBRSxDQUFDLElBQUksQ0FBQztvQkFDakIsWUFBWTtvQkFDWixNQUFNLEVBQUUsS0FBSztpQkFDZDthQUNGLENBQUM7U0FDSDtRQUVELE1BQU0sR0FBRyxHQUFHLEdBQUcsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7UUFDdEMsTUFBTSxLQUFLLEdBQUc7WUFDWixDQUFDLEdBQUcsQ0FBQyxFQUFFLGtCQUFrQixNQUFNLGFBQU4sTUFBTSxjQUFOLE1BQU0sR0FBSSxFQUFFLEtBQ25DLE1BQU0sYUFBTixNQUFNLGNBQU4sTUFBTSxHQUFJLEVBQ1osYUFBYSxZQUFZLE1BQU07U0FDaEMsQ0FBQztRQUVGLE9BQU87WUFDTCxHQUFHLFVBQVU7WUFDYixDQUFDLFlBQVksQ0FBQyxFQUFFO2dCQUNkLEtBQUssRUFBRSxDQUFDLEtBQUssQ0FBQztnQkFDZCxpQkFBaUIsRUFBRSxnQ0FBZ0MsWUFBWSxhQUFhO2dCQUM1RSxVQUFVLEVBQUUsZ0NBQWdDLFlBQVksV0FBVztnQkFDbkUsdUpBQXVKO2dCQUN2SixTQUFTLEVBQUUsQ0FBQyxJQUFJLENBQUM7Z0JBQ2pCLFVBQVUsRUFBRSxDQUFDLFNBQVMsQ0FBQztnQkFDdkIsWUFBWTthQUNiO1NBQ0YsQ0FBQztJQUNKLENBQUMsRUFBRSxFQUE2QixDQUFDLENBQUM7SUFFbEMsT0FBTyxNQUFNLENBQUM7QUFDaEIsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRW50aXR5IH0gZnJvbSBcIi4uL3R5cGVzXCI7XG5pbXBvcnQge1xuICBEWU5BTU9EQl9UT09MQk9YX0dFTkVSQVRFRF9BVFRSSUJVVEVfQUxJQVNFUyxcbiAgTElCX0dFTkVSQVRFRF9BVFRSSUJVVEVfQUxJQVNFUyxcbn0gZnJvbSBcIi4vY29uc3RhbnRzXCI7XG5cbmNvbnN0IFRZUEVfTUFQUElORzogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHtcbiAgc3RyaW5nOiBcIlNcIixcbiAgbnVtYmVyOiBcIk5cIixcbiAgYm9vbGVhbjogXCJCb29sXCIsXG4gIG1hcDogXCJNXCIsXG59O1xuXG5leHBvcnQgY29uc3QgYXBwbHlBdHRyaWJ1dGVQcm9wZXJ0aWVzID0gKFxuICBlbnRpdHk6IEVudGl0eVxuKTogUmVjb3JkPHN0cmluZywgdW5rbm93bj4gPT4ge1xuICBjb25zdCB7IGF0dHJpYnV0ZXMgfSA9IGVudGl0eS5zY2hlbWE7XG5cbiAgY29uc3QgbnVsbFZhbHVlID0gZW50aXR5LnRhYmxlLnJlbW92ZU51bGxBdHRyaWJ1dGVzXG4gICAgPyBudWxsXG4gICAgOiB7XG4gICAgICAgIE5VTEw6IHRydWUsXG4gICAgICB9O1xuXG4gIGNvbnN0IHBhcmFtcyA9IE9iamVjdC5lbnRyaWVzKFxuICAgIGVudGl0eS5hdHRyaWJ1dGVzIGFzIFJlY29yZDxcbiAgICAgIHN0cmluZyxcbiAgICAgIHsgdHlwZTogc3RyaW5nOyBwcmVmaXg6IHN0cmluZzsgc3VmZml4OiBzdHJpbmcgfVxuICAgID5cbiAgKS5yZWR1Y2UoKHRlbXBQYXJhbXMsIFthdHRyaWJ1dGVLZXksIHsgdHlwZSwgcHJlZml4LCBzdWZmaXggfV0pID0+IHtcbiAgICBjb25zdCBhdHRyaWJ1dGVNYXAgPSBhdHRyaWJ1dGVzW2F0dHJpYnV0ZUtleV0ubWFwID8/IGF0dHJpYnV0ZUtleTtcbiAgICBjb25zdCBhdHRyaWJ1dGVBbGlhcyA9IGF0dHJpYnV0ZXNbYXR0cmlidXRlS2V5XS5hbGlhcyA/PyBhdHRyaWJ1dGVLZXk7XG5cbiAgICBpZiAoRFlOQU1PREJfVE9PTEJPWF9HRU5FUkFURURfQVRUUklCVVRFX0FMSUFTRVMuaW5jbHVkZXMoYXR0cmlidXRlQWxpYXMpKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICAuLi50ZW1wUGFyYW1zLFxuICAgICAgICBbYXR0cmlidXRlTWFwXToge1xuICAgICAgICAgIHZhbHVlOiBbeyBcIlMuJFwiOiBgJCQuU3RhdGUuRW50ZXJlZFRpbWVgIH1dLFxuICAgICAgICAgIGlzUGxhY2Vob2xkZXI6IGZhbHNlLFxuICAgICAgICAgIC8vIFdvbid0IGJlIHNlbGVjdGVkIGFueXdheVxuICAgICAgICAgIG51bGxWYWx1ZTogW251bGxdLFxuICAgICAgICAgIGF0dHJpYnV0ZU1hcCxcbiAgICAgICAgICBpc051bGw6IGZhbHNlLFxuICAgICAgICB9LFxuICAgICAgfTtcbiAgICB9XG5cbiAgICBjb25zdCBrZXkgPSBgJHtUWVBFX01BUFBJTkdbdHlwZV19LiRgO1xuICAgIGNvbnN0IHZhbHVlID0ge1xuICAgICAgW2tleV06IGBTdGF0ZXMuRm9ybWF0KCcke3ByZWZpeCA/PyBcIlwifXt9JHtcbiAgICAgICAgc3VmZml4ID8/IFwiXCJcbiAgICAgIH0nLCAkLmRhdGEuJHthdHRyaWJ1dGVNYXB9WzBdKWAsXG4gICAgfTtcblxuICAgIHJldHVybiB7XG4gICAgICAuLi50ZW1wUGFyYW1zLFxuICAgICAgW2F0dHJpYnV0ZU1hcF06IHtcbiAgICAgICAgdmFsdWU6IFt2YWx1ZV0sXG4gICAgICAgIFwiaXNQbGFjZWhvbGRlci4kXCI6IGBTdGF0ZXMuQXJyYXlDb250YWlucygkLmRhdGFbJyR7YXR0cmlidXRlTWFwfSddLCAkLnV1aWQpYCxcbiAgICAgICAgXCJpc051bGwuJFwiOiBgU3RhdGVzLkFycmF5Q29udGFpbnMoJC5kYXRhWycke2F0dHJpYnV0ZU1hcH0nXSwgbnVsbClgLFxuICAgICAgICAvLyBOZWVkIHRvIHNldCBpdCBhcyBhcnJheSB0byBiZSBhYmxlIHRvIGdldCBudWxsIHZhbHVlIGlmIHJlbW92ZU51bGxBdHRyaWJ1dGVzIGlzIHRydWUsIGJlY2F1c2UgRHluYW1vZGIgZG9lcyBub3Qgc3VwcG9ydCBOdWxsIHByb3BlcnRpZXMgc2V0IHRvIGZhbHNlXG4gICAgICAgIG51bGxWYWx1ZTogW251bGxdLFxuICAgICAgICBudWxsMlZhbHVlOiBbbnVsbFZhbHVlXSxcbiAgICAgICAgYXR0cmlidXRlTWFwLFxuICAgICAgfSxcbiAgICB9O1xuICB9LCB7fSBhcyBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPik7XG5cbiAgcmV0dXJuIHBhcmFtcztcbn07XG4iXX0=