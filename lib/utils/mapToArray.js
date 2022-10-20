"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapToArray = void 0;
exports.mapToArray = (entity) => {
    const { attributes } = entity.schema;
    const params = Object.keys(entity.attributes).reduce((temporaryParams, attributeKey) => {
        var _a, _b;
        const attributeMap = (_a = attributes[attributeKey].map) !== null && _a !== void 0 ? _a : attributeKey;
        const attributeAlias = (_b = attributes[attributeKey].alias) !== null && _b !== void 0 ? _b : attributeKey;
        return {
            ...temporaryParams,
            [`${attributeMap}.$`]: `States.Array($.data['${attributeAlias}'])`,
        };
    }, {});
    return params;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFwVG9BcnJheS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm1hcFRvQXJyYXkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBRWEsUUFBQSxVQUFVLEdBQUcsQ0FBQyxNQUFjLEVBQTBCLEVBQUU7SUFDbkUsTUFBTSxFQUFFLFVBQVUsRUFBRSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUM7SUFFckMsTUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FDeEIsTUFBTSxDQUFDLFVBQXFDLENBQzdDLENBQUMsTUFBTSxDQUFDLENBQUMsZUFBZSxFQUFFLFlBQVksRUFBRSxFQUFFOztRQUN6QyxNQUFNLFlBQVksU0FBRyxVQUFVLENBQUMsWUFBWSxDQUFDLENBQUMsR0FBRyxtQ0FBSSxZQUFZLENBQUM7UUFDbEUsTUFBTSxjQUFjLFNBQUcsVUFBVSxDQUFDLFlBQVksQ0FBQyxDQUFDLEtBQUssbUNBQUksWUFBWSxDQUFDO1FBRXRFLE9BQU87WUFDTCxHQUFHLGVBQWU7WUFDbEIsQ0FBQyxHQUFHLFlBQVksSUFBSSxDQUFDLEVBQUUsd0JBQXdCLGNBQWMsS0FBSztTQUNuRSxDQUFDO0lBQ0osQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBRVAsT0FBTyxNQUFNLENBQUM7QUFDaEIsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRW50aXR5IH0gZnJvbSBcIi4uL3R5cGVzXCI7XG5cbmV4cG9ydCBjb25zdCBtYXBUb0FycmF5ID0gKGVudGl0eTogRW50aXR5KTogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9PiB7XG4gIGNvbnN0IHsgYXR0cmlidXRlcyB9ID0gZW50aXR5LnNjaGVtYTtcblxuICBjb25zdCBwYXJhbXMgPSBPYmplY3Qua2V5cyhcbiAgICBlbnRpdHkuYXR0cmlidXRlcyBhcyBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPlxuICApLnJlZHVjZSgodGVtcG9yYXJ5UGFyYW1zLCBhdHRyaWJ1dGVLZXkpID0+IHtcbiAgICBjb25zdCBhdHRyaWJ1dGVNYXAgPSBhdHRyaWJ1dGVzW2F0dHJpYnV0ZUtleV0ubWFwID8/IGF0dHJpYnV0ZUtleTtcbiAgICBjb25zdCBhdHRyaWJ1dGVBbGlhcyA9IGF0dHJpYnV0ZXNbYXR0cmlidXRlS2V5XS5hbGlhcyA/PyBhdHRyaWJ1dGVLZXk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgLi4udGVtcG9yYXJ5UGFyYW1zLFxuICAgICAgW2Ake2F0dHJpYnV0ZU1hcH0uJGBdOiBgU3RhdGVzLkFycmF5KCQuZGF0YVsnJHthdHRyaWJ1dGVBbGlhc30nXSlgLFxuICAgIH07XG4gIH0sIHt9KTtcblxuICByZXR1cm4gcGFyYW1zO1xufTtcbiJdfQ==